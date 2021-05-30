const { lifeNoteDomain, requestWithToken } = require('../api');

const url_notes = lifeNoteDomain + '/notes/notes';
const url_note = lifeNoteDomain + '/notes/note';

function getNotes(data) {
  return requestWithToken({
    url: url_notes,
    method: 'post',
    data,
  });
}

function postNote(data) {
  return requestWithToken({
    url: url_note,
    method: 'post',
    data,
  });
}

function getNote(id) {
  return requestWithToken({
    url: url_note + '/' + id,
    method: 'get',
  });
}

function putNote(id, data) {
  return requestWithToken({
    url: url_note + '/' + id,
    method: 'put',
    data,
  });
}

function deleteNote(id) {
  return requestWithToken({
    url: url_note + '/' + id,
    method: 'delete',
  });
}

module.exports = {
  getNotes,
  postNote,
  getNote,
  putNote,
  deleteNote,
}
