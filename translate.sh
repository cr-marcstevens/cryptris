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
outfile=${infile%.html}_${lang}.html

echo $infile $outfile
cat $infile | sed "s/\(href=.[a-zA-Z]*\)[.]html/\1_en.html/g" | sed -f languages/${lang}.ed > $outfile

}

rm *_*.html

for lg in en ; do

	# convert the language file into a ed script and a javascript file
	rm -f languages/${lg}.ed js/lang_${lg}.js
	echo "var $.lang = {" > js/lang_${lg}.js
	while read -r line; do
		lhs=`echo $line | cut -d= -f1`
		rhs=`echo $line | cut -d= -f2-`
		lhsname=`echo -n $lhs | tr -C "[a-zA-Z_]" "_"`
		rhsescaped=`echo $rhs | tr -d "\""`
		if [ "$lhs" != "" ]; then
			echo "s|${lhs}|${rhs}|g;" | sed "s/\&/\\\&/g" >> languages/${lg}.ed
			echo "${lhsname}:\"${rhsescaped}\"," >> js/lang_${lg}.js
		fi
	done < languages/${lg}.txt
	echo "langend:\"\"};" >> js/lang_${lg}.js

	# process all html files	
	for f in *.html; do
		generate_html_file $f $lg
	done
	
done
