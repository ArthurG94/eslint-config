import litStateDecorator from './litStateDecorator.mjs';
import litPropertyDecorator from './litPropertyDecorator.mjs';
import noTrailingWhitespaceInTaggedTemplates from './noTrailingWhitespaceInTaggedTemplates.mjs';
import noSpaceInIndentation from './noSpaceInIndentation.mjs';
import noMultipleSpacesInTaggedTemplates from './noMultipleSpacesInTaggedTemplates.mjs';

/** @type {import('eslint').ESLint.Plugin} */
export default {
	rules: {
		'state-decorator': litStateDecorator,
		'property-decorator': litPropertyDecorator,
		'no-trailing-whitespace-in-tagged-templates': noTrailingWhitespaceInTaggedTemplates,
		'no-space-in-indentation': noSpaceInIndentation,
		'no-multiple-spaces-in-tagged-templates': noMultipleSpacesInTaggedTemplates
	}
}