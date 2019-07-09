#!/bin/bash

function replace_string_in_file
{
cat "$1" | sed "s/$2/$3/g" > "$1.tmp"
mv "$1.tmp" "$1"
}

function generate_html_file
{
infile=$1
if [ "$infile" != "html/documentation.html" ]; then
	lang=$2
	outfile=$(basename ${infile%.html})_${lang}.html
	echo "Generating ${outfile}"
	#echo $infile $outfile
	cat $infile | sed "s/\(href=.[a-zA-Z]*\)[.]html/\1_${lang}.html/g" | sed -f languages/${lang}.ed > $outfile
else
	echo "Copying ${outfile} (pre-translated)"
	cp html/pre_translated/$outfile $outfile
fi

}

rm *_*.html

echo "Translating HTML files for each language"
for lg in en ; do
	echo -n "Reading substitutions for language ${lg}"

	# convert the language file into a ed script and a javascript file
	rm -f languages/${lg}.ed js/lang_${lg}.js
	echo "lang = {" > js/lang_${lg}.js
	while read -r line; do
		lhs=`echo "$line" | cut -d= -f1`
		rhs=`echo "$line" | cut -d= -f2-`
		lhsname=`echo -n $lhs | tr -C "[a-zA-Z0-9_]" "_"`
		rhsescaped=`echo $rhs | tr -d "\""`
		if [ "$lhs" != "" ]; then
			echo "s|${lhs}|${rhs}|g;" | sed "s/\&/\\\&/g" >> languages/${lg}.ed
			echo "${lhsname}:\"${rhsescaped}\"," >> js/lang_${lg}.js
		fi
		echo -n "."
	done < languages/${lg}.txt
	echo "langend:\"\"};" >> js/lang_${lg}.js
	echo "done"

	# process all html files	
	for f in html/*.html; do
		outfile=$(basename ${f%.html})_${lg}.html
		generate_html_file $f $lg
	done
	
done
