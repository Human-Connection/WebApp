### Emotion Rating

Ahhhhhhhh

```js
new Vue({
  components: {
    'hc-emotion-rating': require('~components/Contributions/EmotionRating.vue')
  },
  data () {
    return {
      contribution: {
        "_id": "59aaf2dc1dc22009ae442be4",
        "userId": "59aa86cf1b89ed063b131494",
        "title": "Dignissimos id quasi et quasi.",
        "type": "post",
        "content": "modi dolores enim Autem velit odio enim atque consectetur reiciendis qui aut. Dolor dolorem aut cum ab qui tempore. Ipsam est sit aspernatur ut sapiente rerum.",
        "teaserImg": "http://lorempixel.com/640/480/food",
        "language": "de_DE",
        "slug": "dignissimos-id-quasi-et-quasi",
        "contentExcerpt": "modi dolores enim Autem velit odio enim atque consectetur reiciendis qui aut. Dolor dolorem aut cum ab qui tempore. Ipsa...",
        "updatedAt": "2017-09-02T02:27:55.000Z",
        "createdAt": "2017-09-02T10:12:55.000Z",
        "emotions": {
            "funny": {
                "percent": 0,
                "count": 1
            },
            "happy": {
                "percent": 0,
                "count": 0
            },
            "surprised": {
                "percent": 0,
                "count": 0
            },
            "cry": {
                "percent": 0,
                "count": 0
            },
            "angry": {
                "percent": 0,
                "count": 0
            }
        },
        "visibility": "public",
        "categoryIds": [],
        "user": {
            "_id": "59aa86cf1b89ed063b131494",
            "email": "wilhelmine_klein17@hotmail.com",
            "name": "Tristian Heidenreich",
            "slug": "saepe-ex-necessitatibus",
            "gender": "string parameter is required!",
            "isnothere": true,
            "timezone": "Europe/Berlin",
            "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/pcridesagain/128.jpg",
            "doiToken": null,
            "confirmedAt": null,
            "deletedAt": null,
            "isVerified": true,
            "verifyToken": "6048d2ff6076bf5e07f2f53b4732e3",
            "verifyShortToken": "566557",
            "role": "user",
            "updatedAt": "2017-09-02T10:24:15.517Z",
            "createdAt": "2017-09-02T10:24:15.517Z",
            "badgesIds": [],
            "__v": 0
        }
      },
      user: {
        "_id": "59aa86cf1b89ed063b131494",
        "email": "test@test.de",
        "name": "Peter Pan",
        "slug": "peter-pan",
        "gender": "m",
        "isnothere": true,
        "timezone": "Europe/Berlin",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/falvarad/128.jpg",
        "doiToken": null,
        "confirmedAt": null,
        "deletedAt": null,
        "isVerified": true,
        "verifyToken": "8dd7a1512ec4db00632d26caf789b3",
        "verifyShortToken": "543957",
        "role": "admin",
        "updatedAt": "2017-09-02T18:05:14.444Z",
        "createdAt": "2017-09-02T18:05:14.444Z",
        "badgesIds": [
            "59aaf2da1dc22009ae442bb5"
        ],
        "__v": 0,
        "_include": [
            "badges"
        ],
        "badges": {
            "_id": "59aaf2da1dc22009ae442bb5",
            "image": {
                "path": "https://cdn.frontify.com/api/screen/thumbnail/XX9MuecGg2sy_CuMKs6FulhegxuoRIqi-7nhTI65O6DOzyS6YQc2s5XIQJgeScEJjTq8puwTMSRzlVkpWRnP3A/1524",
                "alt": "odit",
                "_id": "59aaf2da1dc22009ae442bb6"
            },
            "text": "aut",
            "status": "permanent",
            "type": "quaerat",
            "updatedAt": "2017-09-02T18:05:14.233Z",
            "createdAt": "2017-09-02T18:05:14.233Z",
            "__v": 0
        }
      }
    }
  },
  template: `<hc-emotion-rating :contribution="contribution" :user="user"></hc-emotion-rating>`
})
```