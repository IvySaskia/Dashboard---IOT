var mysql = require('mysql');
var mqtt = require('mqtt');

//CREDENCIALES MYSQL
var con = mysql.createConnection({
  host: "proyectoiot.ga",
  user: "admin_univalle",
  password: "dbproyecto",
  database: "admin_univalle",
  port: 3306
});


//CREDENCIALES MQTT
var options = {
  port: 1883,
  host: 'proyectoiot.ga',
  clientId: 'acces_control_server_' + Math.round(Math.random() * (0- 10000) * -1) ,
  username: 'admin',
  password: 'server123',
  keepalive: 60,
  reconnectPeriod: 1000,
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clean: true,
  encoding: 'utf8'
};

var client = mqtt.connect("mqtt://proyectoiot.ga", options);

//SE REALIZA LA CONEXION
client.on('connect', function () {
  console.log("Conexión  MQTT Exitosa!");
  client.subscribe('+/#', function (err) {
   console.log("Subscripción exitosa!")
  });
})

//CUANDO SE RECIBE MENSAJE
client.on('message', function (topic, message) {
  console.log("Mensaje recibido desde -> " + topic + " Mensaje -> " + message.toString());
  if (topic == "values"){
    var msg = message.toString();
    var sp = msg.split(",");
    var temp1 = sp[0];
    var hum1 = sp[1];
    var humSuelo = sp[2];

    //hacemos la consulta para insertar....
    var query = "INSERT INTO `admin_univalle`.`Datos` (`datos_Temp`, `datos_Hum`, `datos_HumSuelo`) VALUES (" + temp1 + ", " + hum1 + ", " + humSuelo + ");";	
    con.query(query, function (err, result) {
      if (err) throw err;
      console.log("Fila insertada correctamente");
    });
  }
  
});




//nos conectamos
con.connect(function(err){
  if (err) throw err;

  //una vez conectados, podemos hacer consultas.
  console.log("Conexión a MYSQL exitosa!!!")

  //hacemos la consulta
    //var query = "SELECT * FROM devices WHERE 1";
    //con.query(query, function (err, result, fields) {
    //if (err) throw err;
   // if(result.length>0){
   //   console.log(result);
  //  }
  //});

});



//para mantener la sesión con mysql abierta
setInterval(function () {
  var query ='SELECT 1 + 1 as result';

  con.query(query, function (err, result, fields) {
    if (err) throw err;
  });

}, 5000);
