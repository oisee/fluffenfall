#!/usr/local/bin/python3
from array import array
import sys
import struct

PSG1_ID = b'PSG\x1A'
PSG1_REGS = 14
RAW_REGS = 14

class Raw:
    def __init__(self,filename):
        self.raw = bytearray()
        self.psg = bytearray()
        self.filename = filename

    def load(self):
        with open(self.filename, 'rb') as f:
            self.raw = bytearray(f.read())
        #print("Loaded RAW len:", len(self.raw))
        return self.raw

    def convert_to_PSG1(self):
        ay = bytearray(16)
        self.psg += PSG1_ID
        #prevR13 = self.raw[13]; 
        for i in range(0,len(self.raw),RAW_REGS):
            ay = self.raw[i:i+PSG1_REGS]
            c_reg = 0
            if ay[13] == 0xFF:
                for r in ay[:13]:
                    self.psg.append(c_reg)
                    self.psg.append(r)
                    c_reg += 1
            else:
                ay[13] = ay[13] & 0x0f
                for r in ay[:PSG1_REGS]:
                    self.psg.append(c_reg)
                    self.psg.append(r)
                    c_reg += 1
            #prevR13 = ay[13]
            self.psg.append(0xff) #new frame
        self.psg.append(0xfd) #end of music
        return self.psg

    def save_psg(self, filename):
        #print("Saved PSG len:", len(self.psg))
        with open(filename, 'wb') as f:
            f.write(self.psg)
        return filename

if len(sys.argv) == 3:
    infile = sys.argv[1]
    outfile = sys.argv[2]
    #print("in: ", infile )
    #print("out: ", outfile )
    raw = Raw(infile)
    raw.load()
    raw.convert_to_PSG1()
    raw.save_psg(outfile)
else:
    print ("Please specify in- and out- file:")
    print (">raw2psg in.raw out.psg")
    #print (sys.argv)