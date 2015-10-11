##API Specification

1. `POST /adduser/{username}/{age}`
  - *Description* : Create a new user.
  - *Parameters* : `username and age`
  - *Returns* : 
	- `200`: `user Object`
	
2. `POST /getuser/{username}`
  - *Description*: Get user details
  - *Parameters* : `username` - 
  - *Returns* : 
	- `200`: `user Object`

3. `POST /creategame/{username}`
  - *Description*: Create game for username.
  - *Path Parameters* : `username`
  - *Returns* : 
	- `200`: `Game Object`.

4. `POST /endgame/{username}/{gameID}/{score}`
  - *Description*: Create game for username.
  - *Path Parameters* : `username`
  - *Returns* : 
	- `200`: `Game Object`.
	- `404`: `gameID` not found.
	
5. `POST /leaderboard`
  - *Description*: Give global leaderboard`
  - *Path Parameters* : `none`
`- *Returns* : 
	- `200`: Array of users.
	- `404`: leaderboard not available.
  
6. `POST /leaderboard/{username}`
  - *Description*: Give username leaderboard
  - *Path Parameters* : `username`
  - *Returns* : 
	- `200`: Array of users.
	- `404`: leaderboard not available.
