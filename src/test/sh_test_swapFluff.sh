node ./test_rawApplyFluff.js $1 ./channelSwapAB.fluff.json $1.AB
node ./test_rawApplyFluff.js $1.AB ./channelSwapAB.fluff.json $1.ABAB
diff $1 $1.ABAB

node ./test_rawApplyFluff.js $1 ./channelSwapAC.fluff.json $1.AC
node ./test_rawApplyFluff.js $1.AC ./channelSwapAC.fluff.json $1.ACAC
diff $1 $1.ACAC

node ./test_rawApplyFluff.js $1 ./channelSwapBC.fluff.json $1.BC
node ./test_rawApplyFluff.js $1.BC ./channelSwapBC.fluff.json $1.BCBC
diff $1 $1.BCBC