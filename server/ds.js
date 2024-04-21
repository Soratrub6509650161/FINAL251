const mysql = require('mysql2');

// กำหนดค่าสำหรับการเชื่อมต่อกับ MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // แทนที่ด้วยชื่อผู้ใช้ MySQL
  database: 'mydb' // แทนที่ด้วยชื่อฐานข้อมูลที่ต้องการเชื่อมต่อ
});

connection.connect((err) => {
  if (err) {
    console.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับ MySQL: ' + err.stack);
    return;
  }
  console.log('เชื่อมต่อกับ MySQL สำเร็จแล้ว');
});

module.exports = connection;
