window.onscroll = function() {scrollFunction()};
$('#headers').fadeIn(600, function() {})

var menu = document.getElementById('menu');

var fixedMenuPos = menu.offsetTop;
var viewportHeight = window.innerHeight;

var elids = ['firstpage','oCemMluvime','zJakychDat','app']
var currentPos;
var slideNum = 0;
function generateTriggers() {
    var triggers = {}
    for (elid in elids) {
        el = $('#' +elids[elid])
        o = {
                'menutop': el.position().top-100,
                'menubottom':el.position().top + el.height()-100,
                'fadetop': el.position().top - 660,
                'fadebottom':el.position().top + el.height()-200

                }
        triggers[elids[elid]] = o;
    }
    return triggers;
};

var triggers = generateTriggers();

function scrollFunction() {
    currentPos = window.pageYOffset;

    // Fixed menu
    if (currentPos >= fixedMenuPos) {
        menu.classList.add('sticky');
    }
    else {
        menu.classList.remove('sticky')
    }

    // Toggling content of slides

    for (elid in elids) {
        if (currentPos >= triggers[elids[elid]].fadetop && currentPos < triggers[elids[elid]].fadebottom) 
        {
            $('#' + elids[elid] + ' .wrap').fadeIn(600, function() {})
        } else {
            $('#' + elids[elid] + ' .wrap').fadeOut(600, function() {})
        }

        if (currentPos >= triggers[elids[elid]].menutop && currentPos < triggers[elids[elid]].menubottom) {
            slideNum = parseInt(elid)
        }
    }

    for (elid in elids) {
        if (parseInt(elid) <= slideNum) {
            $('#m' + elids[elid]).addClass('storyPast')
        } else {
            $('#m' + elids[elid]).removeClass('storyPast')
        }
    }
};


function MoveOn(divid) {
    $('html,body').animate({
        scrollTop: $('#' +divid).offset().top - 100
    })

    //$('#' + divid + ' .wrap').addClass('wrapActive')
};



function showModal(modal) {
    $('#' + modal).addClass('modalActive')
    $('.modalBackground').fadeIn(200,function() {});
};

function hideModal() {
    $('.modalBackground').fadeOut(200,function() {});
    $('.modalActive').removeClass('modalActive')
};

window.onclick = function(event) {
    modal = document.getElementById('modalWrap')
    if (event.target == modal) {
        hideModal();
    }
}
