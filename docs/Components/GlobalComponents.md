## These are common components used across the whole application. Global Components can be used without import.

### Translation

Translation is done by [vuex-18n (github.com)](https://github.com/dkfbasel/vuex-i18n) and uses message keys located in folder `locale/…` (`de.json`, `en.json` etc.). The translation value is interpreted as string, not as HTML. For embedding HTML you can use the [v-html directive of vuejs.org](https://vuejs.org/v2/api/#v-html). The following code examples illustrate most use cases.

Usage in general is by accessing predefined message keys:
```html
$t('messageKey')
$t('messageKey.from.nestedJson')
$t('non.existing.key', 'default fallback text')
$tlang('en', 'messageKey') // always show the en-Text regardless of present locale definition
``` 
There are also several methods available on the property `this.$i18n` or `Vue.i18n`.

#### Pluralisation & Counting

In case of pluralisation and counting separate the values for translation via `:::` like so:
```json
"translationKey": "one ::: many"
"translationKeyOnePluralNone": "one ::: many ::: none"
"translationKeyCounted": "{count} thing ::: {count} things ::: {count} things"
"translationKeyCounted": "{count} thing ::: {count} things ::: nothing"
```
Code example:
```json
// message key in locale/en.json
"tagCountedOnePluralNone": "{count} tag ::: {count} tags ::: no tags"
// Context in *.vue/HTML files use {{ $t(…) }}
// or in JavaScript context use $t(…)  
$t('tagCountedOnePluralNone', {'count', 0}, 0) // no tags
$t('tagCountedOnePluralNone', {'count', 1}, 1) // 1 tag
$t('tagCountedOnePluralNone', {'count', 5}, 5) // 5 tags
$t('tagCountedOnePluralNone', null, 0) // no tags
$t('tagCountedOnePluralNone', null, 1) // tag
$t('tagCountedOnePluralNone', null, 5) // tags
$t('tagCountedOnePluralNone') // tag ::: tags ::: no tags
```

#### Embedding HTML via v-html

Suggest the following file `en.json` with the message key:
```json
{
  "auth": {
    "account": {
      "confirmTermsOfUsage": "By clicking “register” I agree with the <a href=\"{url}\">{termsOfService}</a> and confirm, that I read the <a href=\"{url}\">{dataPrivacyStatement}</a> of Human Connection."
    }
  },
  "legal": {
    "dataPrivacyStatement": "Data Privacy Statements",
    "termsOfService": "Terms of Service"
  }
}
```

In a VueJS file apply this by:
```html
<!-- in file register.vue -->
<p class="small-info" v-html="$t('auth.account.confirmTermsOfUsage', {
    'termsOfService': $t('legal.termsAndConditions'),
    'dataPrivacyStatement': $t('legal.dataPrivacyStatement'),
    'url': '/legal'
  })"></p>
```

#### Translation Message Keys

In most cases the message key represents a visible label of some kind (i.e a label, button, placeholder, heading, section, title etc.) so a suffix `…Label` is not necessary to append unless it makes a message group more clear, then use suffixes `…Label` or `…Placeholder` to make the intentions of the usage clear to others.

Recommendation for naming the message keys:

* use **camelCase** and **singular** for parent levels
* as **brief** as possible **but meaningful**, not more than 3 levels (the object path can also indicate where to find the use case of the string)
* use **generic suffixes** for responsive messages (`…Info`, `…Warning`, `…Error`) or `…Description` for longer texts, e.g. intended as HTML `title`-attribute, a real paragraph, a longer help text, any longer message
* indicate countable message keys:
  * perhaps by `…OnePluralNone`, e.g.:<br/>`"voteOnePluralNone": "vote ::: votes ::: no vote"` 
  * perhaps by `…BriefOrLong` to have a string to chose from for narrow space (‘brief’) or wider space (‘long’), e.g.:<br/>`"moreInfoBriefOrLong": "more info ::: more information"`
