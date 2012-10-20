echo "" > client/client.build.js
echo "" > engine.build.js
echo "" > server.build.js

cd .\engine\
copy /b ^
.\lib\*.js + ^
engine.js + ^
.\utils\*.js + ^
engine.*.js + ^
.\constructors\*.js + ^
.\assets_types\*.js + ^
.\assets\spaceships\*.js + ^
.\assets\weapons\*.js + ^
.\assets\projectiles\*.js + ^
init.js ^
.\..\engine.build.js

cd ..\client\
copy /b ^
.\..\engine.build.js + ^
client.js + ^
.\lib\lib.*.js + ^
.\utils\*.js + ^
client.*.js + ^
.\constructors\*.js + ^
.\assets\images\*.js + ^
.\assets\materials\*.js + ^
.\assets\prerenders\*.js + ^
.\assets\emitters\*.js + ^
.\assets\effects\*.js + ^
init.js ^
.\client.build.js

cd ..\server\
copy /b ^
server.js + ^
.\lib\*.js + ^
server.*.js + ^
init.js ^
.\..\server.build.js
