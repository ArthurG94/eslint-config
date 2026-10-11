import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin'
import { importX } from 'eslint-plugin-import-x'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import customRules from './rules/index.mjs';

const config = {
	plugins: {
		'@stylistic': stylistic,
		'@custom': customRules,
		'import-x': importX,
	},
	extends: [
		eslint.configs.recommended,
		tseslint.configs.strictTypeChecked,
		tseslint.configs.stylistic,
		stylistic.configs.customize({
			flat: true,
			indent: 'tab',
			quotes: 'single',
			semi: true
		}),
		importX.flatConfigs.recommended,
		importX.flatConfigs.typescript
	],

	languageOptions: {
		parserOptions: {
			projectService: true,
			tsconfigRootDir: import.meta.dirname,
		},
	},
	settings: {
		'import-x/resolver-next': [
			createTypeScriptImportResolver({
			})
		]
	},
	rules: {
		"no-console": ["error", { "allow": ["warn", "error"] }],

		//------------------------------
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": ["error", {
			"enableAutofixRemoval": {
				"imports": true
			}
		}],
		//------------------------------
		"no-useless-constructor": "off",
		"@typescript-eslint/no-useless-constructor": "error",
		//------------------------------
		"no-use-before-define": "off",
		"@typescript-eslint/no-use-before-define": "error",
		//------------------------------
		"semi": ["error", "always"],
		"quotes": ["error", "single"],
		"@stylistic/max-statements-per-line": ["error", { "max": 5 }],
		"@typescript-eslint/restrict-template-expressions": ["error", { "allowNumber": true, "allowBoolean": true }],
		"@typescript-eslint/no-redundant-type-constituents": "off",
		"@typescript-eslint/no-unnecessary-type-assertion": "error",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-unnecessary-type-parameters": "off",
		"no-control-regex": "off",
		"no-param-reassign": "error",
		"@typescript-eslint/explicit-member-accessibility": "error",
		"@typescript-eslint/consistent-indexed-object-style": "off",
		"@stylistic/no-trailing-spaces": "error",
		"@stylistic/brace-style": ["error", "1tbs", { "allowSingleLine": true }],
		"@typescript-eslint/no-inferrable-types": "off",
		//------------------------------
		"@custom/state-decorator": ["error"],
		"@custom/property-decorator": ["error"],
		"@custom/no-trailing-whitespace-in-tagged-templates": ["error", { "tags": ["html", "css"] }],
		"@custom/no-space-in-indentation": ["error", { "tags": ["html", "css"] }],
		"@custom/no-multiple-spaces-in-tagged-templates": ["error", { "tags": ["html"] }],
		"@typescript-eslint/switch-exhaustiveness-check": ["error", { "considerDefaultExhaustiveForUnions": true, "requireDefaultForNonUnion": true }], //On s'assure que tous les cas sont traités dans les switch
		//------------------------------
		"import-x/namespace": "off",
		"import-x/default": "off",
		"import-x/no-named-as-default-member": "off",
		"import-x/no-named-as-default": "off",
		"import-x/no-extraneous-dependencies": ["error", { "devDependencies": false, "optionalDependencies": false, "peerDependencies": false, "includeInternal": false }]
	}
}

export default defineConfig(config, {
	...config,
	files: ['**/*.spec.ts', '**/tests/**/*.ts'],
	rules: {
		...config.rules,
		"import-x/no-extraneous-dependencies": "off"
	}
});