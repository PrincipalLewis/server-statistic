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
        document.getElementById('1').innerHTML += JSON.stringify(i) + '<br>';
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
      obj.forEach(function(data, i) {
        if (i < 10) {
          getTeamFileName(data);
        }
      });
    }
  });
}
function getTeamFileName(file) {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/teamFileName',
    data: JSON.stringify(file),
    success: function(msg) {
      document.getElementById('tableBody').innerHTML +=
          '<tr>' +
              '<td>' + file.projectname + ' ' + file.count + '</td>' +
              '<td>' + file.filename + '</td>' +
      //var obj = JSON.parse(msg);
      //obj.forEach(function(data) {
      //  document.getElementById('tableBody').innerHTML +=
                '<td>' + msg + '</td>' +
                '<td>' + msg + '</td>' +
            '</tr>';
      //});
      //document.getElementById('1').innerHTML += '<br>';
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
        document.getElementById('1').innerHTML += JSON.stringify(i) + '<br>';
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
        document.getElementById('1').innerHTML += JSON.stringify(i) + '<br>';
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
        document.getElementById('1').innerHTML += JSON.stringify(i) + '<br>';
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
    success: function(msg) {
      document.getElementById('1234').innerHTML = 'bla' + msg;
    }
  });
}

function getCrossProjects() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/teamProjects',
    success: function(msg) {
      document.getElementById('1').innerHTML = '';
      var obj = JSON.parse(msg);
      get(obj);
    }
  });

  function get(teamsProject) {
    $.ajax({
      type: 'POST',
      url: 'http://localhost:1337/cross',
      success: function(msg) {
        document.getElementById('1').innerHTML = '';
        var projectsTeam = JSON.parse(msg);
        var flag = 0;
        for (var i in projectsTeam) {
          for (var j in teamsProject) {
            if (projectsTeam[i].projectname === teamsProject[j].projectname) {
              if (projectsTeam[i].teamname === teamsProject[j].teamname) {
                flag = 1;
                break;
              }
            }
          }
          if (flag === 0) {
            document.getElementById('1').innerHTML +=
                projectsTeam[i].projectname + ' ' + projectsTeam[i].teamname +
                                                          '<br>';
          } else {flag = 0;}
        }
      }
    });
  }
}

function createFileTable(file_name, projects){
  var table = document.getElementById('tableBody')
  table.innerHTML +=
  '<tr>' +
  '<td>' + file.projectname + ' ' + file.count + '</td>' +
  '<td>' + file.filename + '</td>'
    //var obj = JSON.parse(msg);
    //obj.forEach(function(data) {
    //  document.getElementById('tableBody').innerHTML +=
  var obj = {
    "filenam":"file",
    "obj.teamname": "team",
    "obj.count":"10"
  };

  projects = [obj]
  var commands ='<td>'
  var counts ='<td>'
    for(var project in projects){
      commands += project.filenam
       counts += project.count
    }

}

