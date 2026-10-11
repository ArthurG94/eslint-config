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
			description: 'Impose la visibilité private ou protected pour les propriétés décorées avec @state()',
			category: 'Best Practices',
			recommended: false
		},
		schema: []
	},
	create(context) {
		function checkNode(node) {
			if(node.decorators && node.decorators.length > 0) {
				const hasState = node.decorators.some(
					d => d.expression && (
						(d.expression.type === 'Identifier' && d.expression.name === 'state') ||
						(d.expression.type === 'CallExpression' && d.expression.callee.name === 'state')
					)
				);
				if (hasState) {
					const accessibility = node.accessibility;
					if (accessibility !== 'private' && accessibility !== 'protected') {
						context.report({
							node,
							message: 'Les propriétés décorées avec @state() doivent être private ou protected.\nUtilisez @property() pour les propriétés publiques.\n',
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
