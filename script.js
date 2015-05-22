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
      document.getElementById('1').innerHTML = '';
      var obj = JSON.parse(msg);
      obj.forEach(function(i) {
        document.getElementById('1').innerHTML += JSON.stringify(i) + '<br>'
      });
    }
  });
}
function getFileName() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/fileName',
    success: function(msg) {
      document.getElementById('1').innerHTML = '';
      var obj = JSON.parse(msg);
      obj.forEach(function(data,i) {
        if (i < 20) {
          //console.log(JSON.stringify(data));
          getTeamFileName(data);
        }
      });
    }
  });
}
function getTeamFileName(file) {
  //console.log(file);
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/teamFileName',
    data: JSON.stringify(file),
    success: function(msg) {
      document.getElementById('1').innerHTML += JSON.stringify(file) + '<br>';
      //document.getElementById('1').innerHTML = '';
      var obj = JSON.parse(msg);
      obj.forEach(function(data,i) {
        if (i < 10) {
          //console.log(JSON.stringify(data));
          document.getElementById('1').innerHTML += JSON.stringify(data) + '<br>'
        }
      });
      document.getElementById('1').innerHTML += '<br>'
    }
  });
}
function getTeamsProjects() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/teamProjects',
    success: function(msg) {
      document.getElementById('1').innerHTML = '';
      var obj = JSON.parse(msg);
      obj.forEach(function(i) {
        document.getElementById('1').innerHTML += JSON.stringify(i) + '<br>'
      });
    }
  });
}

function getTopCommiter() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/topCommiter',
    success: function(msg) {
      document.getElementById('1').innerHTML = '';
      var obj = JSON.parse(msg);
      obj.forEach(function(i) {
        document.getElementById('1').innerHTML += JSON.stringify(i) + '<br>'
      });
    }
  });
}


function getTopCommiterTeam() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/topCommiterTeam',
    success: function(msg) {
      document.getElementById('1').innerHTML = '';
      var obj = JSON.parse(msg);
      obj.forEach(function(i) {
        document.getElementById('1').innerHTML += JSON.stringify(i) + '<br>'
      });
    }
  });
}

function sendDate() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/sendDate',
    data: document.getElementById('Date1').value + '%' +
          document.getElementById('Date2').value,
    //data2: document.getElementById('Date2').value,
    success: function(msg) {
      document.getElementById('1').innerHTML = 'bla' + msg;
    }
  });

}
