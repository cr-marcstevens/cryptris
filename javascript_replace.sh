#!/bin/bash

function replace_string_in_file
{
cat "$1" | sed "s/$2/$3/g" > "$1.tmp"
mv "$1.tmp" "$1"
}

function generate_html_file
{
infile=$1
lang=$2
outfile=$(basename ${infile%.html})_${lang}.html

echo $infile $outfile
cat $infile | sed "s/\(href=.[a-zA-Z]*\)[.]html/\1_${lang}.html/g" | sed -f languages/${lang}.ed > $outfile

}

rm -r js
cp -R js_org js

echo "Adapting original javascript files to enable translations"
for lg in languages/javastrings*.txt; do
	echo -n "Reading substitutions from $lg"

	# convert the language file into a ed script and a javascript file
	rm -f ${lg}.ed
	while read -r line; do
		lhs=`echo "$line" | cut -d'|' -f1 | sed 's/"/\\"/g' `

		rhs=`echo "$line" | cut -d'|' -f2 | sed 's/"/\\"/g' `

		if [ "$lhs" != "" ]; then
			echo "s|${lhs}|${rhs}|g;" >> ${lg}.ed

# to easily find out which string is used where
#			rhs=`echo "$line" | cut -d'|' -f2 | sed 's/"/\\"/g'| grep -o "lang.[A-Z0-9_]*" | head -n1` 
#			echo "s|${lhs}|\"${rhs}\"|g;" >> ${lg}.ed

		fi
		echo -n "."
	done < ${lg}
	echo "done"

	# process all javascript files	
	for f in `find js -name "*.js"`; do
		echo "Processing $f"
		cat $f | sed -f ${lg}.ed > $f.tmp
		mv $f.tmp $f
	done
	
done
