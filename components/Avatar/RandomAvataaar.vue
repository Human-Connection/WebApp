<template>
  <div>
    <div class="user-avatar row is-hidden">
      <img v-if="isReady" :src="url" ref="avataaar" @load="handleImageLoad" />
    </div>
    <canvas width="1056" height="1120" class="is-hidden" ref="avataaarCanvas"></canvas>
    <br />
    <button @click="randomize" class="button is-secondary" :class="{ 'is-loading': isLoading }">{{ $t('button.random' )}}</button>
  </div>
</template>

<script>
  import {sample, keys, isEmpty} from 'lodash'

  export default {
    name: 'random-avataaar',
    data () {
      return {
        styles: {
          topType: [
            'NoHair',
            'Eyepatch',
            'Hat',
            'Hijab',
            'Turban',
            'WinterHat1',
            'WinterHat2',
            'WinterHat3',
            'WinterHat4',
            'LongHairBigHair',
            'LongHairBob',
            'LongHairBun',
            'LongHairCurly',
            'LongHairCurvy',
            'LongHairDreads',
            'LongHairFrida',
            'LongHairFro',
            'LongHairFroBand',
            'LongHairNotTooLong',
            'LongHairShavedSides',
            'LongHairMiaWallace',
            'LongHairStraight',
            'LongHairStraight2',
            'LongHairStraightStrand',
            'ShortHairDreads01',
            'ShortHairDreads02',
            'ShortHairFrizzle',
            'ShortHairShaggyMullet',
            'ShortHairShortCurly',
            'ShortHairShortFlat',
            'ShortHairShortRound',
            'ShortHairShortWaved',
            'ShortHairSides',
            'ShortHairTheCaesar',
            'ShortHairTheCaesarSidePart'
          ],
          accessoriesType: [
            'Blank',
            'Kurt',
            'Prescription01',
            'Prescription02',
            'Round',
            'Sunglasses',
            'Wayfarers'
          ],
          hairColor: [
            'Auburn',
            'Black',
            'Blonde',
            'BlondeGolden',
            'Brown',
            'BrownDark',
            'PastelPink',
            'Platinum',
            'Red',
            'SilverGray'
          ],
          facialHairType: [
            'Blank',
            'BeardMedium',
            'BeardLight',
            'BeardMagestic',
            'MoustacheFancy',
            'MoustacheMagnum'
          ],
          clotheType: [
            'BlazerShirt',
            'BlazerSweater',
            'CollarSweater',
            'GraphicShirt',
            'Hoodie',
            'Overall',
            'ShirtCrewNeck',
            'ShirtScoopNeck',
            'ShirtVNeck'
          ],
          eyeType: [
            'Close',
            'Cry',
            'Default',
            'Dizzy',
            'EyeRoll',
            'Happy',
            'Hearts',
            'Side',
            'Squint',
            'Surprised',
            'Wink',
            'WinkWacky'
          ],
          eyebrowType: [
            'Angry',
            'AngryNatural',
            'Default',
            'DefaultNatural',
            'FlatNatural',
            'RaisedExcited',
            'RaisedExcitedNatural',
            'SadConcerned',
            'SadConcernedNatural',
            'UnibrowNatural',
            'UpDown',
            'UpDownNatural'
          ],
          mouthType: [
            'Concerned',
            'Default',
            'Disbelief',
            'Eating',
            'Grimace',
            'Sad',
            'ScreamOpen',
            'Serious',
            'Smile',
            'Tongue',
            'Twinkle',
            'Vomit'
          ],
          skinColor: [
            'Tanned',
            'Yellow',
            'Pale',
            'Light',
            'Brown',
            'DarkBrown',
            'Black'
          ]
        },
        selected: {
          topType: null,
          accessoriesType: null,
          hairColor: null,
          facialHairType: null,
          clotheType: null,
          eyeType: null,
          eyebrowType: null,
          mouthType: null,
          skinColor: null
        },
        isLoading: false
      }
    },
    computed: {
      url () {
        let stylesStr = ''
        keys(this.selected).forEach(key => {
          stylesStr += `&${key}=${this.selected[key]}`
        })

        return `/avatar/?avatarStyle=Transparent${stylesStr}`
      },
      isReady () {
        return !isEmpty(this.selected.eyebrowType) && !isEmpty(this.selected.mouthType)
      }
    },
    methods: {
      randomize () {
        this.isLoading = true
        keys(this.selected).forEach(key => {
          this.selected[key] = sample(this.styles[key])
        })
      },
      handleImageLoad (e) {
        this.isLoading = false

        const myCanvas = this.$refs.avataaarCanvas
        const ctx = myCanvas.getContext('2d')
        ctx.save()
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, myCanvas.width, myCanvas.height)
        ctx.drawImage(this.$refs.avataaar, 0, 0, myCanvas.width, myCanvas.height)
        myCanvas.toBlob(this.handleBlob, 'image/png', 0.95)
        ctx.restore()
      },
      handleBlob (blob) {
        this.$emit('blob', blob)
      }
    }
  }
</script>

<style scoped lang="scss">
  .user-avatar {
    $borderRadius: 50%;

    border-radius: $borderRadius;
    width:         120px;
    height:        120px;
    position:      relative;
    display:       inline-block;
    background-color: #fff;
    overflow: hidden;

    &:before {
      border-radius: 50%;
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 10;
      pointer-events: none;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    }
  }
</style>
