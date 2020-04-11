const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function verifyId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error: 'repo does not exists'});
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const data = {
    id: uuid(),
    title,
    url,
    techs: [...techs],
    likes: 0,
  }

  repositories.push(data);

  return response.json(data);
});

app.put("/repositories/:id", verifyId, (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  const data = {
    id,
    title,
    url,
    techs,
    likes:  repositories[repoIndex].likes,
  }

  repositories[repoIndex] = data;

  return response.json(repositories[repoIndex]);
});

app.delete("/repositories/:id", verifyId, (request, response) => {
  const {id} = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0){
    return response.status(400).json({error: 'Repo not found'})
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", verifyId,  (request, response) => {
  const {id} = request.params;
  
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  repositories[repoIndex].likes = repositories[repoIndex].likes +1;

  return response.json(repositories[repoIndex]);
});

module.exports = app;
