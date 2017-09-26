## These are common components used across the whole application. Global Components can be used without import.

### Translation

Translation is done by [vue-18n](http://kazupon.github.io/vue-i18n/en/started.html) and uses message keys located in folder `locale`. The following code examples illustrate most use cases. Use `$t('messageKey')` and `$tc('messagekeyWithCount', 32)` for counted things.


		<!-- in a vue file -->
    <!-- rendered as string -->
    <strong>{{ $t('component.contribution.takeAction') }}</strong>
    <!-- v-html when use of markup in messages -->
    <p v-html="$t('legal.dataPrivacyStatementTwitterDescription')"></p>
    <!-- in javascript context -->
    <script>var myPageTitle = this.$t('page.index.title');</script>



In most cases the message key represents a kind of a visible label (can be a label, placeholder, heading, section, title etc.) so a suffix `…Label` is not necessary to be appended unless it makes a message group more clear. Sometimes it is sufficient to have only a placeholder and no label, sometimes you need placeholder and a label, then use suffixes `…Label` or `…Placeholder` to make the intentions of the usage clear to others.

Recommendation for naming the message keys:

* keep them brief but meaningful, no more than 3 levels, the object path can also indicate where to find the application of the string
* use camelCase, use singular for parent levels
* use generic suffixes for responsive messages (`…Info`, `…Warning`, `…Error`)
* use generic suffixes like `…Description` for longer texts, e.g. as `title`-attribute, a paragraph, a help text, any longer message
* indicate countable message keys (applied with `$tc('…', 32)`) by perhaps `…NoneOnePlural`, e.g. `"voteNoneOnePlural": "no vote | vote | votes"`
