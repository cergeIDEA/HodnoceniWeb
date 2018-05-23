var orgs = [],insts = [], includedInsts = [];

function sortMenudata() {
    for (var org in menudata) {
        o = menudata[org]
         if (o.level === 0) {
             orgs.push(o.id);
         }
         else {
             insts.push(org)
             if(o.included === "True") {
                 includedInsts.push(o.id);
             }
         }
    }
}

// Generating Dropdown-list
function createSelect2(selector) {
    controls = $('<div />').addClass('controls')
    select = $('<select />', {id:'ddlSearch',class:'form-control',onchange: "ddlChange('" + selector + "')"});
    select.append('<option />')
    controls.append(select)

    controls.append($('<a id="rstBtn" class="button buttonPassive" onclick="Redraw(\''+selector  +'\')">Obnovit</a>'));
    $(selector).append(controls);

    function formatResult(node) {
      var $result = $('<span style="padding-left:' + (20 * node.level) + 'px;">' + node.text + '</span>');
      return $result;
    };

    $(selector + ' #ddlSearch').select2({
      placeholder: {id:'',text: 'Vyhledejte pracoviště či organizaci ...'},
      allowClear: false,
      width: sizes.chart.width - 90,
      data: menudata,
      formatSelection: function(item) {
          return item.text
      },
      formatResult: function(item) {
          return item.text
      },
        templateResult: formatResult
    });

    return $(selector);
}

function toggleLegendClick(input,legtype,el) {
    selector = '#' + $(el).parent().parent().parent().parent().parent().parent().attr('id')

    if (data[selector].used[legtype].includes(input)) {
        data[selector].used[legtype] = data[selector].used[legtype].filter(e => e != input);
    }
    else {
        data[selector].used[legtype].push(input)
    }
    DrawData(selector);
    $(selector + ' #rstBtn').addClass('buttonActive')

}


function ddlChange(selector) {
    var id  = $(selector + ' #ddlSearch').select2('val');
    unselectAll(selector);
    var anythingSelected = (id !== '') ? true : false;

    if (anythingSelected) {
        var IsOrg = (orgs.includes(id)) ? true : false;
        $(selector + ' #rstBtn').addClass('buttonActive')
        if (IsOrg) {
            listinst = $.map(data[selector].institutions,function(el) {return el;});
            ds = listinst.filter(d => d.Predkladatel_short === id);

            $.each(ds,function(key,value)
                {
                    value.selected = 1;
                });
            descBoxOrg( $(selector + ' #ddlSearch').select2('data')[0].text)
        }
         else {
            if(includedInsts.includes(id)) {
                d = data[selector].institutions[id];
                d.selected = 1;
                openDescBox(selector,d);
            }else {
                d = excludedInsts[id];
                openDescBox(selector,d,false);
            }
        }
    }
    else {
           openDescBoxHelp(selector);
        $(selector + ' #rstBtn').removeClass('buttonActive')

    }
    DrawData(selector);
};

function unselectAll(selector) {
    $.each(data[selector].institutions,function(key,value)
        {
            value.selected = 0;
        })
}

function SelectSinglePoint(selector, d) {
    unselectAll(selector);
    d.selected = 1;
    $(selector + ' #ddlSearch').val(d.ID).change()
    $(selector + ' #rstBtn').addClass('buttonActive')
    openDescBox(selector,d);
  
}

function openDescBox(selector,d,IsAvailable=true){
    div = $('#descbox')
    div.hide();
    div.empty();
    if (IsAvailable) {
        div = descBoxData(div,d);
    }
    else {
        div = descBoxNA(div,d);
    }
    div.fadeIn('fast');
}

function descBoxData(div,d) {
    div = div.append('<p><strong>' + d.Jednotka_name + '</strong> (' + d.Predkladatel_long + ')</p>')
    div = div.append('<p>V letech 2011 - 2015 instituce do RIV přihlásila celkem ' + d.Total + ' výsledků. Z nich ' + d.Czech + ' vyšlo v místních a dalších ' + d.Predatory + ' v predátorských časopisech</p>')
    div = div.append('<p>Stáhněte si seznam článků v <a href="xls/'+ d.JEDNOTKA +'_Predatory.xlsx">predátorských</a> a <a href="xls/'+ d.JEDNOTKA +'_Local.xlsx">místních</a> časopisech nebo <a href="xls/'+ d.JEDNOTKA +'_All.xlsx">všech</a> článků zařazených do analýzy.</p>')     
    return div
}

function descBoxNA(div) {
    div = div.append('<p><strong>' + d.Jednotka_name + '</strong> (' + d.Predkladatel_long + ')</p>')
    div = div.append('<p>Pro toto pracoviště není k dispozici dostatečný počet relevantních výsledků a proto do analýzy nebylo zařazeno.</p>')
    return div
}

function descBoxOrg(org) {
    div = $('#descbox')
    div.hide();
    div.empty();

    div = div.append('<p><strong>' + org + '</strong></p>')
    div.fadeIn('fast');

}

function descBoxDefault() {
    div = $('#descbox')
    div.hide();
    div.empty();
    div.append('<p>Kliknutím na legendu <strong>zobrazíte či skryjete</strong> různé obory a typy pracovišť</p>')
    div.append('<p>Pro podrobnosti <strong>klikněte</strong> na jednotlivý bod či <strong>vyhledejte</strong> konkrétní pracoviště podle názvu v roletkovém menu nad grafem.</p>')
    div.append('<p>Za vybrané pracoviště si <strong>stáhněte</strong> seznam článků v predátorských, místních nebo všech článích zařazených do analýzy.</p>')

    div.fadeIn('fast')
}
