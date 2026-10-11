# @turtl/eslint-config

Configuration ESLint partagée (flat config, ESLint 10) :

- `@eslint/js` recommended
- `typescript-eslint` `strictTypeChecked` + `stylistic`
- `@stylistic` : indentation tabs, quotes simples, points-virgules
- `eslint-plugin-import-x` (resolver TypeScript), interdiction des dépendances non déclarées (désactivée dans les tests `*.spec.ts` / `tests/**`)
- Règles custom (`@custom/*`) :
  - `state-decorator` / `property-decorator` : conventions des décorateurs Lit `@state` / `@property`
  - `no-trailing-whitespace-in-tagged-templates`
  - `no-space-in-indentation`
  - `no-multiple-spaces-in-tagged-templates`

## Installation

```bash
npm install --save-dev eslint github:ArthurG94/eslint-config#<tag-ou-commit>
```

Épingler un tag (`#v0.3.0`) ou un SHA de commit garantit des installations reproductibles.

## Utilisation

`eslint.config.mjs` :

```js
import config from '@turtl/eslint-config';

export default [
	...config,
	{
		files: ['vitest.config.ts'],
		rules: {
			'import-x/no-extraneous-dependencies': 'off'
		}
	}
];
```

Les règles custom sont aussi exposées seules :

```js
import customRules from '@turtl/eslint-config/rules';
```

## Publier une version

1. Mettre à jour `version` dans `package.json` et `CHANGELOG.md`
2. `git tag vX.Y.Z && git push --tags`
3. Mettre à jour la référence `#vX.Y.Z` dans les projets consommateurs
