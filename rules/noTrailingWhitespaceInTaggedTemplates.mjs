// Règle ESLint personnalisée : vérifie qu'il n'y a pas de caractères blancs en fin de ligne dans les template literals HTML et CSS
// @fileoverview Cette règle vérifie que toute chaîne de caractères taggée avec html ou css ne contient pas de caractères blancs en fin de ligne.

/**
 * Règle pour vérifier l'absence de caractères blancs en fin de ligne dans les template literals taggés
 * 
 * Exemple d'utilisation :
 * // Valide :
 * html`<div>
 *   <p>Texte</p>
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
			description: "Vérifie l'absence de caractères blancs en fin de ligne dans les template literals taggés html ou css",
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
			// Au lieu de TaggedTemplateExpression, on utilise TemplateLiteral comme dans l'exemple fourni
			// Cela permet de capturer tous les templates, même ceux dans des fonctions arrow
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
						const regex = /([\s]+)$/;
						
						// Position de départ pour le calcul des positions
						let range = node.range[0];
						
						// Pour chaque ligne du template
						for (const [index, line] of lines.entries()) {
							const match = regex.exec(line);
							
							// Si on a trouvé des espaces en fin de ligne
							if (match?.index !== undefined && match[1]) {
								// On reporte l'erreur
								context.report({
									loc: {
										start: {
											line: node.loc.start.line + index,
											column: line.length - match[1].length
										},
										end: {
											line: node.loc.start.line + index,
											column: line.length
										}
									},
									message: 'Caractères d\'espacement en fin de ligne inattendu',
									fix(fixer) {
										return fixer.replaceTextRange([range + match.index, range + match.index + match[1].length], '');
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
