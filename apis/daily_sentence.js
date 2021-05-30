const { lifeDailySentenceDomain, requestWithToken } = require('../api');

const url_daily_sentences = lifeDailySentenceDomain + '/daily_sentence/daily_sentences';
const url_daily_sentence = lifeDailySentenceDomain + '/daily_sentence/daily_sentence';
const url_add_daily_sentence = lifeDailySentenceDomain + '/daily_sentence/add_daily_sentence';


function getDailySentences(data) {
  return requestWithToken({
    url: url_daily_sentences,
    method: 'post',
    data,
  });
}

function postDailySentence(data) {
  return requestWithToken({
    url: url_daily_sentence,
    method: 'post',
    data,
  });
}

function getDailySentence(id) {
  return requestWithToken({
    url: url_daily_sentence + '/' + id,
    method: 'get',
  });
}

function putDailySentence(id, data) {
  return requestWithToken({
    url: url_daily_sentence + '/' + id,
    method: 'put',
    data,
  });
}

function deleteDailySentence(id) {
  return requestWithToken({
    url: url_daily_sentence + '/' + id,
    method: 'delete',
  });
}

function addDailySentence(data) {
  return requestWithToken({
    url: url_add_daily_sentence,
    method: 'post',
    data,
  });
}


module.exports = {
  getDailySentences,
  postDailySentence,
  getDailySentence,
  putDailySentence,
  deleteDailySentence,
  addDailySentence,
}

