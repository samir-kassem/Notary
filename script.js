const file_content = document.querySelector("#fileContent");
const book_title = document.querySelector("#fileName");
const search_field = document.querySelector('#keyword');
const search_stat = document.querySelector("#searchStat");
const search_btn = document.querySelector("#search-btn");
const most_used = document.querySelector('#mostUsed');
const least_used = document.querySelector('#leastUsed');
const doc_length = document.querySelector("#docLength");
const word_count = document.querySelector("#wordCount");
const char_count = document.querySelector("#charCount");
const replace_btn = document.querySelector("#replace-btn");
const rep_con = document.querySelector('#replace-container');
const rep_in = document.querySelector('#replace_input');
const rep_submit = document.querySelector('#replace_submit');
const rep_span = document.querySelector('#replace_flag');


function load_book (file_path, book_name) {
    let req = new XMLHttpRequest();
    let url = "books/" + file_path;
    let book_content;

    req.open("GET", url, true);
    req.send();
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200){
            book_content = req.responseText;
            doc_stats(book_content);
            book_content = book_content.replace(/(?:\r\n|\r|\n)/g, '<br>');
            file_content.innerHTML = book_content;
            file_content.scrollTop = 0;
            book_title.innerHTML = book_name;
            search_field.value = "";
            search_stat.querySelector('h4').innerHTML = "";
        }
    }
}

function doc_stats(book_content){
    let text = book_content.toLowerCase();
    let word_arr = text.match(/\b\S+\b/g);
    let uncommon_words = get_uncommon(word_arr);
    let word_dict = {};

    for(let i in uncommon_words) {
        let word = uncommon_words[i];
        if(word_dict[word]){
            word_dict[word]++;
        } else {
            word_dict[word] = 1;
        }
    }

    let entries = Object.entries(word_dict);
    entries.sort(function(a,b){
        return b[1] - a[1];
    });

    let top_5 = entries.slice(0,6);
    let least_5 = entries.slice(-6, entries.length);
    for(let entry of top_5){
        most_used.insertAdjacentHTML("beforeend",`<li>${entry[0]} : ${entry[1]} ${entry[1] > 1 ? 'times' : 'time'}.</li>`);
    }

    for(let entry of least_5){
        least_used.insertAdjacentHTML("beforeend", `<li>${entry[0]} : ${entry[1]} ${entry[1] > 1 ? 'times' : 'time'}.</li>`);
    }

    doc_length.innerText = "Document Length: " + text.length;
    word_count.innerText = "Word Count: " + word_arr.length;
}

function get_uncommon(arr){
    let flag = {};
    let common_words = getStopWords();
    let res_arr = [];
    for(let word in common_words) {
        flag[common_words[word]] = true;
    }
    arr.forEach(item => {
        if(!flag[item])
            res_arr.push(item);
    });
    return res_arr;
}

function getStopWords() {
    return ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
}

search_btn.addEventListener('click', () => {
    let keyword = search_field.value;
    let curr_content = file_content.innerHTML;
    let new_content;
    if(keyword.length && !curr_content.includes("Select a book on the right")){
        let spans = Array.from(document.querySelectorAll('mark'));
        for(let i=0; i<spans.length; i++){
            spans[i].outerHTML = spans[i].innerHTML;
            console.log("outer", spans[i].outerHTML);
            console.log("inner", spans[i].innerHTML);
        }

        let reg_exp = new RegExp(keyword, 'gi');
        let replace_text = "<mark id='markme'>$&</mark>";
        curr_content = file_content.innerHTML;
        new_content = curr_content.replace(reg_exp, replace_text);
        file_content.innerHTML = new_content;
        let length = file_content.querySelectorAll('mark').length;
        search_stat.querySelector('h4').innerText = keyword + " count: " + length;
        search_stat.querySelector('button').style.display = "inline-block";
        if(length > 0){
            let element = file_content.querySelector("#markme");
            file_content.scrollTop = element.offsetTop;
        }
    }
});

// function mark_words(){
//     let keyword = document.querySelector('#keyword').value;
//     let display = document.querySelector('#fileContent');
//     let new_content = "";
//     let spans = document.querySelectorAll('mark');

//     // Unselect all marked words:  <mark>Frodo</mark> => Frodos
//     for(let i=0; i<spans.length; i++){
//         spans[i].outerHTML = spans[i].innerHTML;
//     }

//     let reg = new RegExp(keyword, "gi");
//     var replaceText = "<mark id='markme'>$&</mark>";
//     let book_content = display.innerHTML; 
//     new_content = book_content.replace(reg, replaceText);
//     display.innerHTML = new_content;
//     let count = document.querySelectorAll('mark').length;
//     document.querySelector("#searchStat").innerHTML = "found " + count + " matches";

//     if(count > 0){
//         let el = document.querySelector("#markme");
//         el.scrollIntoView();
//     }
// }

search_field.addEventListener('keyup', () => {
    search_btn.disabled = false;
}); 



document.querySelector('#replace-btn').addEventListener('click', () => {
    rep_con.style.display = "flex";
    rep_con.querySelector('#replace_flag').innerText = search_field.value;
});

rep_submit.addEventListener('click', () => {
    let keyword = search_field.value;
    let rep = rep_in.value;
    let curr_content = file_content.innerHTML;
    let reg_exp = new RegExp(keyword, 'gi');
    let replace_text = "<mark id='markme'>" + rep + "</mark>";
    let new_content = curr_content.replace(reg_exp, replace_text);
    file_content.innerHTML = new_content;
    rep_con.style.display = "none";
    search_stat.querySelector('h4').innerText = "";
    search_stat.querySelector('button').style.display = "none";
    search_field.value = "";
    rep.value = "";
});