./raw2psg.py $1 $1.py.psg
./psg2raw.py $1.py.psg $1.py.raw
diff $1 $1.py.raw

node ./test_raw2psg.js $1 $1.js.psg
node ./test_psg2raw.js $1.js.psg $1.js.raw
diff $1 $1.js.raw

diff $1.py.psg $1.js.psg  
diff $1.py.raw $1.js.raw  