/**
 * Сколько раз коммители проект
 */
function getProjectsCommitCount() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/commitCount',
    data: getDate(),
    success: function(msg) {
      document.getElementById('tableBody').innerHTML = '';
      document.getElementById('tableHead').innerHTML =
          '<tr> ' +
              '<th>Проект</th> ' +
              '<th>Колличество коммитов</th>' +
          '</tr>';
      var obj = JSON.parse(msg);
      obj.forEach(function(i) {
        document.getElementById('tableBody').innerHTML +=
            '<tr>' +
                '<td>' + JSON.stringify(i.projectname) + '</td>' +
                '<td>' + JSON.stringify(i.commits) + '</td>' +
            '<tr>';
      });
    },
    error: function(msg) {
      document.getElementById('body').innerHTML =
          '' + msg.status + ' ' + msg.statusText + '<br>' +
              msg.responseText;
    }
  });
}


/**
 * Какие файлы коммитились
 * Какие команды и сколько раз коммители файл
 */
function getFileName() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/fileName',
    data: getDate(),
    success: function(msg) {
      document.getElementById('tableBody').innerHTML = '';
      document.getElementById('tableHead').innerHTML =
          '<tr> ' +
              '<th>Имя файла</th>' +
              '<th>Проект</th> ' +
              '<th>КоличествоКоммитов</th>' +
              '<th>Команды</th>' +
              '<th>Колличество коммитов</th>' +
          '</tr>';
      var obj = JSON.parse(msg);
      obj.forEach(function(data) {
        createTable(data);
      });
    },
    error: function(msg) {
      document.getElementById('body').innerHTML =
          '' + msg.status + ' ' + msg.statusText + '<br>' +
          msg.responseText;
    }
  });
  function createTable(data) {
    if (data.teams.length) {
      var teams = '';
      var counts = '';
      for (var team in data.teams) {
        teams += data.teams[team].teamname + '<br>';
        counts += data.teams[team].count + '<br>';
      }
      document.getElementById('tableBody').innerHTML +=
          '<tr>' +
              '<td>' + data.file.filename + '</td>' +
              '<td>' + data.file.projectname + '</td>' +
              '<td>' + data.file.count + '</td>' +
              '<td>' + teams + '</td>' +
              '<td>' + counts + '</td>' +
          '</tr>';
    } else {
      document.getElementById('tableBody').innerHTML +=
          '<tr>' +
              '<td>' + data.file.filename + '</td>' +
              '<td>' + data.file.projectname + '</td>' +
              '<td>' + data.file.count + '</td>' +
              '<td>' + 'nothing' + '</td>' +
              '<td>' + 'nothing' + '</td>' +
          '</tr>';
    }
  }
}


/**
 * Какие проекты доступны командам
 */
function getTeamsProjects() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/teamProjects',
    data: getDate(),
    success: function(msg) {
      document.getElementById('tableBody').innerHTML = '';
      document.getElementById('tableHead').innerHTML =
          '<tr> ' +
              '<th>Проект</th> ' +
              '<th>Название команды</th>' +
          '</tr>';
      var obj = JSON.parse(msg);
      obj.forEach(function(i) {
        document.getElementById('tableBody').innerHTML +=
            '<tr> ' +
                '<td>' + JSON.stringify(i.projectname) + '</td> ' +
                '<td>' + JSON.stringify(i.teamname) + '</td>' +
            '</tr>';
      });
    },
    error: function(msg) {
      document.getElementById('body').innerHTML =
          '' + msg.status + ' ' + msg.statusText + '<br>' +
          msg.responseText;
    }
  });
}


/**
 * Кто больше всех коммитит
 */
function getTopCommiter() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/topCommiter',
    data: getDate(),
    success: function(msg) {
      document.getElementById('tableBody').innerHTML = '';
      document.getElementById('tableHead').innerHTML =
          '<tr> ' +
              '<th>Логин</th> ' +
              '<th>Колличество коммитов</th>' +
          '</tr>';
      var obj = JSON.parse(msg);
      obj.forEach(function(i) {
        document.getElementById('tableBody').innerHTML +=
            '<tr> ' +
                '<td>' + JSON.stringify(i.login) + '</td> ' +
                '<td>' + JSON.stringify(i.count) + '</td>' +
            '</tr>';
      });
    },
    error: function(msg) {
      document.getElementById('body').innerHTML =
          '' + msg.status + ' ' + msg.statusText + '<br>' +
          msg.responseText;
    }
  });
}


/**
 * Какие команды чаще всего коммитят
 */
function getTopCommiterTeam() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/topCommiterTeam',
    data: getDate(),
    success: function(msg) {
      document.getElementById('tableBody').innerHTML = '';
      document.getElementById('tableHead').innerHTML =
          '<tr> ' +
              '<th>Название команды</th> ' +
              '<th>Колличество коммитов</th>' +
          '</tr>';
      var obj = JSON.parse(msg);
      obj.forEach(function(i) {
        document.getElementById('tableBody').innerHTML +=
            '<tr> ' +
                '<td>' + JSON.stringify(i.teamname) + '</td> ' +
                '<td>' + JSON.stringify(i.commits) + '</td>' +
            '</tr>';
      });
    },
    error: function(msg) {
      document.getElementById('body').innerHTML =
          '' + msg.status + ' ' + msg.statusText + '<br>' +
          msg.responseText;
    }
  });
}


/**
 * Отправка даты
 * @return {string}
 */
function getDate() {
  return document.getElementById('Date1').value + '%' +
      document.getElementById('Date2').value;

  //setCookie('since', document.getElementById('Date1').value);
  //setCookie('until', document.getElementById('Date2').value);
  //console.log('since', getCookie('since'));
  //console.log('until', getCookie('until'));

  //$.ajax({
  //  type: 'POST',
  //  url: 'http://localhost:1337/sendDate',
  //  data: document.getElementById('Date1').value + '%' +
  //          document.getElementById('Date2').value,
  //  success: function(msg) {
  //    console.log(msg);
  //    document.getElementById('1').innerHTML = 'bla' + msg;
  //  }
  //});
}


/**
 * Какие команды изменяют не доступные им проекты
 */
function getCrossProjects() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/cross',
    data: getDate(),
    success: function(msg) {
      document.getElementById('tableBody').innerHTML = '';
      document.getElementById('tableHead').innerHTML =
          '<tr> ' +
              '<th>Название проекта</th> ' +
              '<th>Название команды</th>' +
          '</tr>';
      var obj = JSON.parse(msg);
      for (var i in obj) {
        document.getElementById('tableBody').innerHTML +=
            '<tr> ' +
                '<td>' + JSON.stringify(obj[i].projectName) + '</td> ' +
                '<td>' + JSON.stringify(obj[i].teamName) + '</td>' +
            '</tr>';
      }
    },
    error: function(msg) {
      document.getElementById('body').innerHTML =
          '' + msg.status + ' ' + msg.statusText + '<br>' +
          msg.responseText;
    }
  });
}


/**
 * Изменение проекта командами
 */
function commitTeamProjects() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:1337/%',
    data: getDate(),
    success: function(msg) {
      document.getElementById('tableBody').innerHTML = '';
      var obj = JSON.parse(msg);
      document.getElementById('tableHead').innerHTML =
          '<tr> ' +
              '<th>Проект</th> ' +
              '<th>Команды</th>' +
              '<th>Колличество коммитов в %</th>' +
          '</tr>';

      obj.forEach(function(data) {
        createTable(data);
      });
      function createTable(data) {
        var teams = '';
        var counts = '';
        for (var i in data.teams) {
          teams += data.teams[i].teamName + '<br>';
          counts += data.teams[i].value + '<br>';
        }
        document.getElementById('tableBody').innerHTML +=
            '<tr>' +
                '<td>' + data.projectName + '</td>' +
                '<td>' + teams + '</td>' +
                '<td>' + counts + '</td>' +
            '</tr>';
      }
    },
    error: function(msg) {
      document.getElementById('body').innerHTML =
          '' + msg.status + ' ' + msg.statusText + '<br>' +
          msg.responseText;
    }
  });
}
