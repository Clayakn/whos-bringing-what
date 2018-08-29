const axios = require('axios')

module.exports = {
    login: (req, res) => {
        const payload = {
            client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            code: req.query.code,
            grant_type: 'authorization_code',
            redirect_uri: `https://${req.headers.host}/auth/callback`
        };

        const dbInstance = req.app.get('db');
        function tradeCodeForAccessToken() {
            return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, payload)
        }

        function tradeAccessTokenForUserInfo(response) {
            const accessToken = response.data.access_token
            return axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo?access_token=${accessToken}`)
        }

        function fetchAuth0AccessToken(userInfoResponse){
            req.session.user = userInfoResponse.data;
            console.log('req.session.user', req.session.user)
            const payload = {
                grant_type: 'client_credentials',
                client_id: process.env.NODE_APP_CLIENT_ID,
                client_secret: process.env.NODE_APP_CLIENT_SECRET,
                audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`
              }
              return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, payload)
        }
        function fetchFacebookAccessToken(auth0AccessTokenResponse){
            const options = {
              headers: {
                authorization: `Bearer ${auth0AccessTokenResponse.data.access_token}`
              }
            }
            return axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${req.session.user.sub}`, options)
          }

        function storeUserInfoAndEventsInDataBase(response){
            // Request to get all events that user is linked to (attending, interested, created)
         axios.get(`https://graph.facebook.com/me?fields=events{id,name,cover,description,place,rsvp_status,start_time,admins}&access_token=${response.data.identities[0].access_token}`)
            .then(events => {
                console.log('events',events.data.events.data)
                const auth0id = response.data.identities[0].user_id
                // Checking to see if user is in our Database
                dbInstance.read_user_by_auth0_id(auth0id).then(users => {
                    if (users.length) {
                        const user = {
                            id: users[0].id,
                            username: users[0].username,
                            email: users[0].email,
                            profile_pic: users[0].profile_pic
                        } 
                        req.session.user = user;
                        res.redirect('/feed');
                    // If user is not in database then create user and store in Database
                    } else {
                        const createUserData = {
                            auth0id,
                            email: response.data.email,
                            username: response.data.name,
                            profilePicture: response.data.picture_large
                        }
                dbInstance.create_user(createUserData).then(newUsers => {
                        const user = {
                            id: newUsers[0].id,
                            username: newUsers[0].username,
                            email: newUsers[0].email,
                            profile_pic: newUsers[0].profile_pic
                        } 
                        req.session.user = user;
                        res.redirect('/feed');
                    })
                    }
                })
                // Checking through each event that Facebook gave back
                events.data.events.data.forEach(e => {
                    // Get all events that are in the Database
                    dbInstance.read_events().then(events => {
                        // Check events in the Database with the id of the new events coming in, if new events are not in database then keep going
                      if(events.findIndex(event => event.event_id === e.id) === -1) {
                            // Check to see if user is going, if user is unsure/interested, event will not be displayed
                            if(e.rsvp_status === "attending") {
                                let event = { 
                                    eventId: e.id ? e.id : 'none',
                                    eventName: e.name ? e.name : 'none',
                                    eventPhoto: e.cover ? e.cover.source ? e.cover.source : 'none' : 'none',
                                    description: e.description ? e.description : 'none', 
                                    place: e.place ? e.place.name ? e.place.name : 'none' : 'none',
                                    city: e.place ? e.place.location ? e.place.location.city ? e.place.location.city : 'none' : 'none' : 'none',
                                    country: e.place ? e.place.location ? e.place.location.country ? e.place.location.country : 'none' : 'none' : 'none',
                                    latitude: e.place ? e.place.location ? e.place.location.latitude ? e.place.location.latitude : null : null : null,
                                    longitude: e.place ? e.place.location ? e.place.location.longitude ? e.place.location.longitude : null : null : null,
                                    state: e.place ? e.place.location ? e.place.location.state ? e.place.location.state : 'none' : 'none' : 'none',
                                    street: e.place ? e.place.location ? e.place.location.street ? e.place.location.street : 'none' : 'none' : 'none',
                                    zip: e.place ? e.place.location ? e.place.location.zip ? e.place.location.zip : 'none' : 'none' : 'none',
                                    startTime: e.start_time ? e.start_time : 'none',
                                    creatorId: e.admins ? e.admins.data ? e.admins.data[0].id ? e.admins.data[0].id : null : null : null
                                }
                                // Store created event in Database
                                dbInstance.create_event(event).then(events => {
                                    dbInstance.read_user([req.session.user.id]).then(users => {
                                        // Checking to see if user that logged in is the creator of the event being currently stored
                                        if(events[0].creator_id != users[0].auth0_id) {
                                            // If user is not the creator, then create a invitations row to link user currently logged in with event currently being stored
                                            dbInstance.create_invitation({eventId: events[0].id, userId: users[0].id})
                                        }
                                    })
                                })
                            }
                        // If the event is already in the database 
                        } else { 
                            // Get the index where the event from the database, matches the event that is currently being checked on
                            const index = events.findIndex(event => event.event_id === e.id)
                            dbInstance.read_user([req.session.user.id]).then(users => {
                                // if the event that is in the database is was not created by the user that is currently logged in 
                                events[index].creator_id != users[0].auth0_id ? 
                                // Checking to see if they are already invited through our invitations table
                                    dbInstance.read_invitations().then(invitations => {
                                        // If they have not been invited yet, linked the event and user through the invitations table
                                        if(invitations.findIndex(e => e.event_id === events[index].id && e.user_id === users[0].id) === -1) {dbInstance.create_invitation({eventId: events[index].id, userId: users[0].id})}
                                    })
                                : ''    
                            })
                        }
                    })
                }) 
            }).catch(error => {
                res.status(500).json({message: error})
            })
        }
        tradeCodeForAccessToken()
        .then(tradeAccessTokenForUserInfo)
        .then(fetchAuth0AccessToken)
        .then(fetchFacebookAccessToken)
        .then(storeUserInfoAndEventsInDataBase)
        .catch(error => {
            console.log('---- error with login', error)
            res.status(500).json({message: 'Server error. See server terminal'})
        })
    },
    logout: (req, res) => {
        req.session.destroy();
        res.status(200).redirect('/');
    },
    createRequestedItem: (req, res) => {
        const dbInstance = req.app.get('db')
        const { eventId } = req.params 
        const { name } = req.body
        dbInstance.create_item({
            name,
            eventId,
            userId: req.session.user.id,
            spokenfor: false
        })
        .then(items => {
            res.status(200).json(items)
        }).catch(error => {
            console.log('---- error with createRequestedItem', error)
            res.status(500).json({message: 'Server error. See server terminal'})
        })
    },
    deleteRequestedItem: (req, res) => {
        const dbInstance = req.app.get('db')
        const { itemId, eventId } = req.params
        dbInstance.delete_item([itemId])
        .then(() => {
            dbInstance.read_items([eventId])
            .then(items => {
                res.status(200).json(items)
            })
        }).catch(error => {
            console.log('---- error with deleteRequestedItem', error)
            res.status(500).json({message: 'Server error. See server terminal'})
        })
    },
    updateRequestedItem: (req, res) => {
        const dbInstance = req.app.get('db')
        const { name } = req.body
        const { itemId, eventId } = req.params
        dbInstance.update_item({name, itemId})
        .then(() => {
            dbInstance.read_items([eventId])
            .then(items => {
                res.status(200).json(items)
            })
        }).catch(error => {
            console.log('---- error with updateRequestedItem', error)
            res.status(500).json({message: 'Server error. See server terminal'})
        })
    },

}