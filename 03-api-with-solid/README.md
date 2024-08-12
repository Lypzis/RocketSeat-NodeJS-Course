# App

GymPass style app.

## FR (Functional Requirements)

- [x] Must be possible to register;
- [x] Must be possible to authenticate;
- [x] Must be possible to get a loged in user profile;
- [x] Must be possible to get the number of check-ins by the loged in user;
- [x] Must be possible for the user to get his check-ins history;
- [x] Must be possible for the user to get the nearest gyms (up to 10km);
- [x] Must be possible for the user to search a gym by name;
- [x] Must be possible for the user to do a check-in in a gym;
- [x] Must be possible to validate the user check-in;
- [x] Must be possible to register a gym;

## BR (Business Rules)

- [x] The user must have a unique email;
- [x] The user cannot do 2 check-ins in the same day;
- [x] The user cannot do a check-in if he is not close(100m) from a gym;
- [x] The check-in can only be validated after 20 minutes of creation;
- [x] The check-in can only be validated by administrators;
- [x] The gym can only be registered by admnistrator;

## NFR (Non-Functional Requirements)

- [x] The user password must be hashed;
- [x] The application data must be persistent in a PostgreSQL database;
- [x] All the lists must be paginated with 20 items per page;
- [x] The user can be identified by a JWT(JSON Web Token);
