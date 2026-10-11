// Règle ESLint personnalisée : vérifie qu'il n'y a pas d'espaces dans l'indentation des template literals HTML et CSS
// @fileoverview Cette règle vérifie que l'indentation dans les chaînes de caractères taggées avec html ou css utilise des tabulations et non des espaces.

/**
 * Règle pour vérifier l'absence d'espaces dans l'indentation des template literals taggés
 * 
 * Exemple d'utilisation :
 * // Valide :
 * html`<div>
 * 	<p>Texte</p>
 * </div>`;
 * 
 * // Invalide :
 * html`<div>
 *   <p>Texte</p>
 * </div>`;
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export default {
	meta: {
		type: 'problem',
		docs: {
			description: "Vérifie l'absence d'espaces dans l'indentation des template literals taggés html ou css",
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
		// Par défaut, on vérifie les tags html et css
		const options = context.options[0] || {};
		const tags = options.tags || ['html', 'css'];

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
				if ((prevToken && tags.includes(prevToken.value))
					|| (prevComment && tags.includes(prevComment.value))
				) {
					// Si oui, on analyse le template literal
					if (node.range && node.loc) {
						// Récupère le texte du template
						const source = context.sourceCode.getText(node);
						const lines = source.split('\n');
						const regex = /^([ \t]+[ ]+).+$/;
						
						// Position de départ pour le calcul des positions
						let range = node.range[0];
						
						// Pour chaque ligne du template
						for (const [index, line] of lines.entries()) {
							const match = regex.exec(line);
							
							// Si on a trouvé des espaces dans l'indentation
							if (match?.[1]) {
								// On reporte l'erreur
								context.report({
									loc: {
										start: {
											line: node.loc.start.line + index,
											column: 0
										},
										end: {
											line: node.loc.start.line + index,
											column: match[1].length
										}
									},
									message: 'Espace dans l\'indentation inattendu',
									fix(fixer) {
										return fixer.replaceTextRange([range, range + match[1].length], match[1].replace(/ {4}/, '\t').replace(/ {2}/, '\t'));
									}
								});
							}
							
							// On incrémente la position pour la ligne suivante (+1 pour le caractère \n)
							range += line.length + 1;
						}
					}
				}
			}
		};
	}
};
