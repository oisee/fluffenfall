#!/usr/local/bin/python3
from array import array
import sys
import struct

PSG1_ID = b'PSG\x1A'
PSG1_REGS = 14
RAW_REGS = 16

class Psg:
    def __init__(self, filename):
        self.filename = filename
        self.psg = bytearray()
        self.raw = bytearray()
    def load(self):
        with open(self.filename, 'rb') as f:
            self.psg = bytearray(f.read())
        #print("Loaded PSG len:", len(self.psg))
        return self.psg

    def convert_to_RAW(self):
        if PSG1_ID == self.psg[0:4]:
            #print('PSG1 detected')
            #print(self.psg[0:4])
            return self.parse_PSG1()

    def parse_PSG1(self):
        c_reg = 0
        ay = bytearray(RAW_REGS)
        state = 'inidata'
        r13_changed = False
        for b in self.psg[17:]:
            #print(format(b,'02x'))
            if state == 'inidata':
                if b >= 0x00 and b <= 0x0d:
                    c_reg = b
                    state = 'regdata'
                    if b == 13:
                        r13_changed = True
                elif b >= 14 and b <= 15:
                    pass
                elif b == 0xfd:
                    state = 'eom'
                    if r13_changed == False:
                        ay[13]= ay[13] & 0x0f | 0x80
                    for r in ay:
                        self.raw.append(r)
                    break
                elif b == 0xfe:
                    state = 'multieoi'
                    r13_changed = False
                elif b == 0xff:
                    if r13_changed == False:
                        ay[13]= ay[13] & 0x0f | 0x80
                    for r in ay:
                        self.raw.append(r)
                    state = 'inidata'
                    r13_changed = False
            elif state == 'regdata':
                ay[c_reg] = b
                state = 'inidata'
            elif state == 'multieoi':
                #print(state, b)
                for _ in range(b * 4):
                    for r in ay:
                        self.raw.append(r)
                state = 'inidata'
            elif state == 'eom':
                for r in ay:
                    self.raw.append(r)
                return self.raw
            elif state == 'error':
                print("error")
            else:
                print("Somehow:", state)
                state = 'error'
        return self.raw

    def save_raw(self,filename):
        #print("Saved RAW len:", len(self.raw))
        with open(filename, 'wb') as f:
            f.write(self.raw)
        return filename

if len(sys.argv) == 3:
    infile = sys.argv[1]
    outfile = sys.argv[2]
    #print("in: ", infile )
    #print("out: ", outfile )
    psg = Psg(infile)
    psg.load()
    psg.parse_PSG1()
    psg.save_raw(outfile)
else:
    print ("Please specify in- and out- file:")
    print (">psg2raw in.psg out.raw")
    #print (sys.argv)