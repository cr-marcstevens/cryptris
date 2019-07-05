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

for lg in languages/javastrings*.txt; do
	echo "Processing $lg"

	# convert the language file into a ed script and a javascript file
	rm -f ${lg}.ed
	while read -r line; do
		lhs=`echo "$line" | cut -d'|' -f1 | sed 's/"/\\"/g' `
		#| tr -C "[ a-zA-Z0-9_,.!\"\t\n]" "." | sed "s/[.][.][.]*/..*/g"`
		rhs=`echo "$line" | cut -d'|' -f2 | sed 's/"/\\"/g' `
		if [ "$lhs" != "" ]; then
			echo "s|${lhs}|${rhs}|g;" >> ${lg}.ed
		fi
	done < ${lg}

	# process all javascript files	
	for f in `find js -name "*.js"`; do
		cat $f | sed -f ${lg}.ed > $f.tmp
		mv $f.tmp $f
	done
	
done
