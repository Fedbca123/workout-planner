# Senior Design 1 Workout Planner

Developed by:
- Robert Farrell
- Steven Horn
- Nestor Rubio
- Omar Shalaby
- Alice Zhang

A mobile application designed to offer a fresh interface for the scheduling and completion of workouts while introducing the benefits of having friends aware of the scheduling. This allows entering the fitness community to become a social thing on top of a personal endeavor, something that may help many people.

To run in development environment (localhost server):
`npm run dev`

To run in production environment (Azure API server):
`npm run prod`

To make a call with axios:
> API_Instance already has baseURL loaded into it. Only need to provide endpoint path, body, and headers
```javascript
import API_Instance from "path to backend/axios_instance.js";
// when making a call, do something like the following. Notice no baseURL just endpoint path, body, headers needed
API_Instance.post("workouts/add", bodyData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'authorization': `BEARER ${globalState.authToken}`
    },
});
```