<template>
  <div class="widget column is-full-mobile is-half-tablet is-one-third-widescreen" :class="{used}">
    <div class="top">
      <div class="is-5 title bandname">Alpha-Boardingpass</div>
      <div class="is-6 subtitle">Human-Connection</div>
      <div style="background-color: #fff;">
        <div class="barcode">
          <strong class="code">{{ code }}</strong>
        </div>
      </div>
    </div>
    <div class="rip-container">
      <div class="rip"></div>
    </div>
    <div class="bottom">
      <a class="copy-btn" href="#">{{ $t('auth.settings.invitesCopyLink', 'copy link') }}</a>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      code: {
        type: String,
        required: true
      },
      used: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .widget {
    filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.2));
    cursor: pointer;
    user-select: none;

    transition: 150ms ease-in-out;

    &:active {
      transform: rotate(5deg);
    }

    .subtitle {
      margin-top: -1.5rem;
      color: #999;
    }

    .top {
      flex-direction: column;
    }

    .bottom {
      flex-direction: row
    }

    .top,
    .bottom {
      > div {
        padding: 0 18px;
        &:first-child {
          padding-top: 18px;
        }
        &:last-child {
          padding-bottom: 18px;
        }
      }
      img {
        padding: 18px 0;
      }
    }
    .top,
    .bottom,
    .rip {
      background-color: #fff;
    }
    .top {
      position: relative;
      border-top-right-radius: 5px;
      border-top-left-radius: 5px;
      .deetz {
        padding-bottom: 10px !important;
      }
    }
    .barcode {
      background-color: #fff;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF4AAAABCAYAAABXChlMAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAACPSURBVChTXVAJDsMgDOsrVpELiqb+/4c0DgStQ7JMYogNh2gdvg5VfXFCRIZaC6BOtnoNFpvaumNmwb/71Frrm8XvgYkker1/g9WzMOsohaOGNziRs5inDsAn8yEPengTapJ5bmdZ2Yv7VvfPN6AH2NJx7nOWPTf1/78hoqgxhzw3ZqYG1Dr/9ur3y8vMxgNZhcAUnR4xKgAAAABJRU5ErkJggg==);
      background-repeat: repeat-y;
      margin-top: 10px;
      height: 20px;
      text-align: right;
      padding-right: 2px;
    }
    .bottom {
      border-bottom-right-radius: 5px;
      border-bottom-left-radius: 5px;
      padding: 18px;
      // height: 30px;
      padding-top: 10px;
      .copy-btn {
        display: inline-block;
        display: block;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        text-transform: uppercase;
        background-color: $blue;
        padding: 0 18px;
        line-height: 30px;
        border-radius: 15px;
        color: #fff;
        text-decoration: none;
      }
    }
    .rip {
      height: 14px;
      margin: 0 5px;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAACCAYAAAB7Xa1eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAAAaSURBVBhXY5g7f97/2XPn/AcCBmSMQ+I/AwB2eyNBlrqzUQAAAABJRU5ErkJggg==);
      background-size: 4px 2px;
      background-repeat: repeat-x;
      background-position: center;
      position: relative;
      box-shadow: 0 1px 0 0 #fff, 0 -1px 0 0 #fff;
      &:before,
      &:after {
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        top: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        border: 5px solid transparent;
        border-top-color: #fff;
        border-right-color: #fff;
        border-radius: 100%;
        pointer-events: none;
      }
      &:before {
        left: -5px;
      }
      &:after {
        transform: translate(-50%, -50%) rotate(225deg);
        right: -25px;
      }
    }
    &.used {
      pointer-events: none;
      cursor: not-allowed;
      opacity: .7;

      .bottom {
        display: none;
      }
      .rip-container {
        height: 7px;
        // margin-bottom: 7px;
        overflow: hidden;
        padding: 0;
      }
      .code {
        text-decoration: line-through;
        color: #999;
      }
    }
  }
</style>
