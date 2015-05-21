function getHui() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/getHui',
    success: function(msg) {
      document.getElementById('1').innerHTML = msg;
    }
  });
}
function getProjectsCommitCount() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/commitCount',
    success: function(msg) {
      document.getElementById('1').innerHTML = msg;
    }
  });
}
function getFileName() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/fileName',
    success: function(msg) {
      document.getElementById('1').innerHTML = msg;
    }
  });
}

function getTeamsProjects() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/teamProjects',
    success: function(msg) {
      document.getElementById('1').innerHTML = msg;
    }
  });
}

function getTopCommiter() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/topCommiter',
    success: function(msg) {
      document.getElementById('1').innerHTML = msg;
    }
  });
}


function getTopCommiterTeam() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/topCommiterTeam',
    success: function(msg) {
      document.getElementById('1').innerHTML = msg;
    }
  });
}
