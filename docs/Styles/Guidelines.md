### When writing SCSS / CSS please follow these basic rules:

**Stay DRY**

First of all check [Bulma](http://bulma.io/documentation/overview/start/) and the `/styles` Folder if there already is a class that fits your needs. Otherwise decide if the class you need should be in global scope or rather is specific to this single task.

If it is global, put it in one of the global SCSS files (`_typography.scss`, `_form.scss`, etc.).

If it is specific, put the styles in your component / page in a `<styles lang="scss" scoped>` tag.

**Use Variables**

Make use of the variables in `_variables.scss` as needed. Basic text sizes and colors should always be set as a variable.

**Keep it simple**

Be sure to just add the styles / classes that are needed at the moment.