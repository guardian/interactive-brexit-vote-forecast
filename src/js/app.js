import mustache from 'mustache'
import axios from 'axios'
import chartHTML from '!raw-loader!./../templates/chart.html'

const dataurl = "https://interactive.guim.co.uk/docsdata/1lG3HvTwaxzTOl6DcAp_PT-B1_VZmgX7uUMmTveM21o8.json"

const target = document.querySelector('.gv-chart-target')


axios.get(dataurl).then(r => {
    var totals = r.data.sheets.totalsOutput;
    console.log(totals);
    totals.map(p => {
        for (var prop in p) {
            if (p[prop] == '#N/A') {
                p[prop] = 0;
            } 
        }
        p.For = parseInt(p.For);
        p.Against = parseInt(p.Against);
        p.UnconfirmedFors = parseInt(p.UnconfirmedFors);
        p.majorFor = p.For > 29 ? true : false;
        p.majorAgainst = p.Against > 29 ? true : false;
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
    var totalUnconfirmedFors = 0;
    totals.forEach(p => {
        totalUnconfirmedFors = totalUnconfirmedFors + p.UnconfirmedFors;
    } )
    var largestcategory = totalAgainst > totalFor ? totalAgainst : totalFor;
    totals.map((p,i) => {
        console.log(i);
        p.forWidth = 100 * (p.For / largestcategory);
        p.againstWidth = 100 * (p.Against / largestcategory);
        p.unconfirmedWidth = 100 * (p.UnconfirmedFors / largestcategory);
        p.confirmedForWidth = p.forWidth - p.unconfirmedWidth;
        // if (i = 0) {
        //     p.againstLeft = 0;
        // } else {
        //     p.againstLeft = 
        // }

    })

    var chartoutput = mustache.render(chartHTML, {totals,totalFor,totalAgainst,totalUnconfirmedFors})
    target.innerHTML = chartoutput;

    window.resize();
})