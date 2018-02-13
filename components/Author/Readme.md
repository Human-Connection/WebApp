### Created Now
```
<author :post="{ createdAt: new Date(), user: { name: 'Peter Pan', avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/pixage/128.jpg' } }" />
```

### Created at specific date and without image
```
<author :post="{ createdAt: new Date('2017-07-19T06:54:07.000Z'), user: { name: 'Captain Hook', avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/peter576/128.jpg' } }" />
```

### Anonymus without image
```
<author :post="{ createdAt: new Date('2015-02-14'), user: { name: 'Anonymus' } }" />
```
