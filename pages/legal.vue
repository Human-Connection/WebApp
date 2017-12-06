<template>
  <div class="columns">
    <div class="column is-8 is-offset-2">
      <div class="card">
        <section class="section">
          <div class="content">
            <h1>{{ $t('legal.imprint') }}</h1>
            <h3>{{ $t('legal.disclaimer') }}</h3>
            <h4>{{ $t('legal.liabilityForContent') }}</h4>
            <p>{{ $t('legal.liabilityForContentDescription') }}</p>
            <h4>{{ $t('legal.liabilityForLinks') }}</h4>
            <p>{{ $t('legal.liabilityForLinksDescription') }}</p>
            <h4>{{ $t('legal.copyrights') }}</h4>
            <p>{{ $t('legal.copyrightsDescription') }}</p>
            <h4>{{ $t('legal.dataProtection') }}</h4>
            <p v-html="$t('legal.dataProtectionDescription')"></p>
            <h4>{{ $t('legal.disclaimerUsageFacebookPlugin') }}</h4>
            <p v-html="$t('legal.disclaimerUsageFacebookPluginDescription')"></p>
            <h4>{{ $t('legal.dataPrivacyStatementGooglePlus') }}</h4>
            <h5>{{ $t('legal.dataPrivacyStatementGooglePlusInformationGatheringAndTransfer') }}</h5>
            <p>{{ $t('legal.dataPrivacyStatementGooglePlusInformationGatheringAndTransferDescription') }}</p>
            <h5>{{ $t('legal.dataPrivacyStatementGooglePlusInformationUsage') }}</h5>
            <p>{{ $t('legal.dataPrivacyStatementGooglePlusInformationUsageDescription') }}</p>
            <h4>{{ $t('legal.dataPrivacyStatementTwitter') }}</h4>
            <p v-html="$t('legal.dataPrivacyStatementTwitterDescription')"></p>
            <h4><em>{{ $t('legal.references') }}</em></h4>
            <p><em>
              <a href="https://www.google.com/analytics/learn/privacy.html">{{ $t('legal.disclaimerGoogleAnalytics') }}</a>, <a href="http://www.google.com/intl/en/policies/privacy/">{{ $t('legal.disclaimerGooglePlus') }}</a>, <a href="http://twitter.com/privacy">{{ $t('legal.disclaimerTwitter') }}</a>
            </em></p>

            <h3>{{ $t('legal.informationAccordingTMG') }}</h3>
            <p v-html="$t('legal.informationAccordingTMGAddress')"></p>

            <dl>
              <dt>{{ $t('legal.informationAccordingTMGCeoAndFounder') }}</dt>
              <dd>{{ $t('legal.informationAccordingTMGCeoDennisHack') }}</dd>

              <dt>{{ $t('legal.informationAccordingTMGContact') }}</dt>
              <dd>+49 151 43 80 42 22, <a href="mailto:info@human-connection.org">info@human-connection.org</a>, <a href="www.human-connection.org">www.human-connection.org</a></dd>

              <dt>{{ $t('legal.informationAccordingTMGUstId') }}</dt>
              <dd>DE 284651760</dd>

              <dt>{{ $t('legal.informationAccordingTMGBankAccount') }}</dt>
              <dd><strong>GLS Bank</strong>, <strong>IBAN:</strong> DE08 4306 0967 7024 1934 00 | <strong>BIC/SWIFT:</strong> GENODEM1GLS</dd>
            </dl>

          </div>
        </section>
      </div>
    </div>
  </div>
</template>


<script>
  export default {
    head () {
      return {
        title: this.$t('legal.imprint')
      }
    }
  }
</script>


<style scoped lang="scss"></style>
