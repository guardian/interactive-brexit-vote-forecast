import mustache from 'mustache'
import axios from 'axios'
import chartHTML from '!raw-loader!./../templates/chart.html'

//const dataurl = "https://interactive.guim.co.uk/docsdata/1lG3HvTwaxzTOl6DcAp_PT-B1_VZmgX7uUMmTveM21o8.json"
const dataurl = "https://interactive.guim.co.uk/docsdata-test/1j7e_fEZi-chBwR0LowmImsMNVEPUM3mFU8VTy_S8FTw.json"


const target = document.querySelector('.gv-chart-target')


axios.get(dataurl).then(r => {
    var totals = r.data.sheets.summary;
    console.log(totals);
    totals.map(p => {
        for (var prop in p) {
            if (p[prop] == '#N/A') {
                p[prop] = 0;
            } 
        }
        p.PartyClass = p.Party.replace(/ /g,"");
        p.For = parseInt(p.For);
        p.Against = parseInt(p.Against);
        p.majorFor = p.For > 19 ? true : false;
        p.majorAgainst = p.Against > 19 ? true : false;
        p.zeroFor = p.For == 0 ? true : false;
        p.zeroAgainst = p.Against == 0 ? true : false;
    });
    var totalFor = 0;
    totals.forEach(p => {
        totalFor = totalFor + p.For;
    } )
    var totalAgainst = 0;
    totals.forEach(p => {
        totalAgainst = totalAgainst + p.Against;
    } )
    var largestcategory = totalAgainst > totalFor ? totalAgainst : totalFor;
    totals.map((p,i) => {
        console.log(i);
        p.forWidth = 100 * (p.For / largestcategory);
        p.againstWidth = 100 * (p.Against / largestcategory);
    })

    var chartoutput = mustache.render(chartHTML, {totals,totalFor,totalAgainst})
    target.innerHTML = chartoutput;

    window.resize();
})