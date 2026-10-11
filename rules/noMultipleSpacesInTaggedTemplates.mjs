// Règle ESLint personnalisée : vérifie qu'il n'y a pas d'espaces multiples dans les template literals HTML
// @fileoverview Cette règle vérifie que toute chaîne de caractères taggée avec html ne contient pas plusieurs espaces consécutifs au milieu d'une ligne.

/**
 * Règle pour vérifier l'absence d'espaces multiples dans les template literals taggés
 * L'indentation et les espaces en fin de ligne sont ignorés (gérés par no-space-in-indentation et no-trailing-whitespace-in-tagged-templates)
 *
 * Exemple d'utilisation :
 * // Valide :
 * html`<div class="a b">
 * 	<p>${texte} ${autre}</p>
 * </div>`;
 *
 * // Invalide :
 * html`<div class="a  b">
 * 	<p>${texte}  ${autre}</p>
 * </div>`;
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export default {
	meta: {
		type: 'problem',
		docs: {
			description: "Vérifie l'absence d'espaces multiples dans les template literals taggés html",
			category: 'Stylistic Issues',
			recommended: false
		},
		fixable: 'whitespace',
		schema: [{
			type: 'object',
			properties: {
				tags: {
					type: 'array',
					items: {
						type: 'string'
					}
				}
			},
			additionalProperties: false
		}]
	},
	create(context) {
		// Par défaut, on vérifie uniquement le tag html
		const options = context.options[0] || {};
		const tags = options.tags || ['html'];

		return {
			TemplateLiteral(node) {
				// Récupère le token précédant le template literal
				let prevToken = context.sourceCode.getTokenBefore(node);

				// Récupère également les commentaires précédant le template au cas où le tag serait dedans
				const prevComment = context.sourceCode.getCommentsBefore(node)[0];

				// Si le token précédent n'est pas un identifiant, on l'ignore
				if (prevToken?.type !== 'Identifier') {
					prevToken = null;
				}

				// Vérifie si le token précédent ou le commentaire précédent est dans la liste des tags
				if (!(prevToken && tags.includes(prevToken.value))
					&& !(prevComment && tags.includes(prevComment.value))
				) {
					return;
				}

				// On analyse uniquement les parties statiques du template (pas le code des expressions ${...})
				for (const quasi of node.quasis) {
					const raw = quasi.value.raw;
					// Le texte brut commence après le caractère ` ou }
					const start = quasi.range[0] + 1;
					const regex = / {2,}/g;
					let match;

					while ((match = regex.exec(raw)) !== null) {
						const end = match.index + match[0].length;

						// Espaces suivis d'un retour à la ligne : espaces en fin de ligne, gérés par une autre règle
						if (raw[end] === '\n' || raw[end] === '\r') {
							continue;
						}

						// Espaces précédés uniquement de blancs depuis le début de la ligne : indentation, gérée par une autre règle
						const lineStart = raw.lastIndexOf('\n', match.index);
						if (lineStart !== -1 && /^[ \t]*$/.test(raw.slice(lineStart + 1, match.index))) {
							continue;
						}

						const rangeStart = start + match.index;
						const rangeEnd = start + end;

						context.report({
							loc: {
								start: context.sourceCode.getLocFromIndex(rangeStart),
								end: context.sourceCode.getLocFromIndex(rangeEnd)
							},
							message: 'Espaces multiples inattendus',
							fix(fixer) {
								return fixer.replaceTextRange([rangeStart, rangeEnd], ' ');
							}
						});
					}
				}
			}
		};
	}
};
