"""
birdgps2json.py - convert bird GPS data to JSON

Terry N. Brown, terrynbrown@gmail.com, Fri Apr 07 14:18:49 2017
"""

import json
import os
import sys
from collections import namedtuple, defaultdict

def try_number(s):
    """Try and convert s to a number, if possible"""
    try:
        return int(s)
    except ValueError:
        try:
            return float(s)
        except ValueError:
            return s

def main():

    directory = sys.argv[1] if len(sys.argv) > 1 else '.'
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        if not filepath.endswith(".txt"):
            continue
        outpath = os.path.join(directory, filename[:-3]+'json').replace(' ', '_')
        if os.path.exists(outpath):
            print("'%s' done already, skipping" % filename)
            continue
        infile = open(filepath)
        header = [
            i.strip().replace(' ', '_').replace('(', '_').replace(')', '_')
            for i in next(infile).split("  ")  # TWO spaces
            if i.strip() != ''
        ]
        Record = namedtuple("Record", header)
        records = []
        for line in infile:
            if not line.strip():
                break
            record = [
                try_number(i.strip())
                for i in next(infile).split(" ")  # ONE spaces
                if i.strip() != ''
            ]
            records.append(Record(*record)._asdict())

        json.dump(records, open(outpath, 'w'), indent=0)
        print("Created '%s'" % outpath)

if __name__ == '__main__':
    main()

