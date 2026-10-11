// Règle ESLint personnalisée : impose la visibilité private ou protected pour les propriétés décorées avec @state()
// @fileoverview Cette règle vérifie que toute propriété décorée avec @state() est déclarée private ou protected.

/**
 * @param {import('eslint').Rule.RuleContext} context
 * @returns {import('eslint').Rule.RuleListener}
 *
 * Exemple d'utilisation :
 * class MyClass {
 *   @state() private foo; // OK
 *   @state() protected bar; // OK
 *   @state() public baz; // Erreur
 *   @state() qux; // Erreur
 * }
 */
export default {
	meta: {
		type: 'problem',
		docs: {
			description: 'Impose la visibilité public pour les propriétés décorées avec @property()',
			category: 'Best Practices',
			recommended: false
		},
		schema: []
	},
	create(context) {
		function checkNode(node) {
			if(node.decorators && node.decorators.length > 0) {
				const hasProperty = node.decorators.some(
					d => d.expression && (
						(d.expression.type === 'Identifier' && d.expression.name === 'property') ||
						(d.expression.type === 'CallExpression' && d.expression.callee.name === 'property')
					)
				);
				if (hasProperty) {
					const accessibility = node.accessibility;
					if (accessibility !== 'public') {
						context.report({
							node,
							message: 'Les propriétés décorées avec @property() doivent être publiques.\nUtilisez @state() pour les propriétés privées ou protégées.\n',
						});
					}
				}
			}
		}
		return {
			AccessorProperty: checkNode,
		};
	}
};
