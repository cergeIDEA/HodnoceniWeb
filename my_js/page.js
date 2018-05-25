var sizes = {}

var waypoints;


function loadJS() {

    sortMenudata();
            
    getSizes();

    DrawAllCharts();

    waypoints = waypointing();

    checkResolution();

    $('.whitebox').css('left',sizes.chart.width - 350)

    shareLinks();

}

function checkResolution() {

    w = $(window).width()
    if (w<1201) {
        $('#myurl2').val(bitly)
        showModal('modRozliseni')
    }
}

function waypointing() {
    function activatefix(selector) {
        $('.fixactive').removeClass('fixactive');
        $(selector).addClass('fixactive');
    };

    function fixBox(selector,parent,target,toppos) {
        element = $(parent+ ' ' +selector).detach();
        $(target).append(element)
        $(target  + ' ' + selector).css({top:toppos,'box-shadow':'0 0 0 0'})
    }

    function floatBox(selector,parent,target) {
        element = $(parent + ' ' + selector).detach();
        $(target).append(element)
        $(element).css({top:'0px','box-shadow': '0px 0px 20px 4px #d1d4d3'})
    }
    
    // fixing menu and adding shadow 
    waypoints = $('#menu').waypoint(function(direction) {
        if(direction === 'down') {
            $('#everything').append($('<div class="stickyshadow"></div>'));
            $('#menu').addClass('sticky');
            $('#menu').removeClass('floaty');
            $('#menuempty').css('display','block')
        } else {
            $('#menu').addClass('floaty');
            $('#menu').removeClass('sticky');
            $('#menuempty').css('display','none')
            $('.stickyshadow').remove();
        }});
        
    waypoints = $('#oCemMluvime').waypoint({handler:function(direction) {
                if (direction === 'down') {
                    $('#moCemMluvime').addClass('storyPast')
                } else {
                    $('#moCemMluvime').removeClass('storyPast')
                }},offset:'17%'});


    waypoints = $('#zJakychDat').waypoint({handler:function(direction) {
        if (direction === 'down') {
            $('#mzJakychDat').addClass('storyPast')
        } else {
            $('#mzJakychDat').removeClass('storyPast')
        }},offset:'17%'});
    
    
    // waypoints = $('#oCemMluvime').waypoint({handler:function(direction) {
    //     if (direction === 'down') {
    //         $('#oCemMluvime').removeClass('flow')
    //         $('#oCemMluvime').addClass('fix')
    //         activatefix('#oCemMluvime')

    //     } else {
    //         $('#oCemMluvime').css('position','float')
    //     }},offset:'0%'});

    

    waypoints = $('#oCemMluvime').waypoint(function(direction) {
        if (direction === 'down') {
            activatefix('#app')
        } else {
            activatefix('#intro')
        }});
            
    waypoints = $('#empt-app').waypoint({handler:function(direction) {
        if (direction === 'down') {
            $('#mapp').addClass('storyPast')
        } else {
            $('#mapp').removeClass('storyPast')
        }},offset:'17%'});


    waypoints = $('#dyk_wrap').waypoint({handler: function(direction) {
        if (direction === 'down') {
            fixBox('#didyouknow','#dyk_wrap','.fixactive .chartcontainer',$('#mainApp .controls').position().top )
        } else {
            floatBox('#didyouknow','.fixactive .chartcontainer','#dyk_wrap .chartcontainer')
        }
    },
        offset:$('#mainApp .controls').position().top
    })

    waypoints = $('#desc_wrap').waypoint({handler: function(direction) {
        if (direction === 'down') {
            fixBox('#descbox','#desc_wrap','.fixactive .chartcontainer',$('#mainApp .controls').position().top + $('#didyouknow').height()+50 )
        } else {
            floatBox('#descbox','.fixactive .chartcontainer','#desc_wrap .chartcontainer')
        }
    },
        offset:$('#mainApp .controls').position().top + $('#didyouknow').height() +50
    })



    waypoints = $('#LifeSocial').waypoint(function(direction) {
        if(direction === 'down') {
            $('#mLifeSocial').addClass('storyPast')
        } else {
            $('#mLifeSocial').removeClass('storyPast')
        }
    },
     {offset:'17%'}
    );

    waypoints = $('#avcr').waypoint(function(direction) {
        if(direction === 'down') {
            $('#mUnivAv').addClass('storyPast')
        } else {
            $('#mUnivAv').removeClass('storyPast')
        }
    },
     {offset:'17%'}
    );


    waypoints = $('#LifeSocial').waypoint(function(direction) {
        if(direction === 'down') {
            data['#mainApp'].used.fields = ['Společenské vědy','Přírodní vědy']
            data['#mainApp'].used.types = data['#mainApp'].default.types

            Redraw('#mainApp',false,false)
        } else {
            data['#mainApp'].used.fields = data['#mainApp'].default.fields
            data['#mainApp'].used.types = data['#mainApp'].default.types

            Redraw('#mainApp',false,false)
        }
    },
     {offset:'60%'}
    );

    waypoints = $('#avcr').waypoint({handler:function(direction) {
        if(direction === 'down') {
            data['#mainApp'].used.fields = data['#mainApp'].default.fields
            data['#mainApp'].used.types = ['Akademie věd ČR']

            Redraw('#mainApp',false,false)
        } else {
            data['#mainApp'].used.fields = ['Společenské vědy','Přírodní vědy']
            data['#mainApp'].used.types = data['#mainApp'].default.types;

            Redraw('#mainApp',false,false)
        }
    },offset:'60%'}    );

    waypoints = $('#univs').waypoint({handler:function(direction) {
        if(direction === 'down') {
            data['#mainApp'].used.fields = data['#mainApp'].default.fields
            data['#mainApp'].used.types = ['Vysoké školy']

            Redraw('#mainApp',false,false)
        } else {
            data['#mainApp'].used.fields = data['#mainApp'].default.fields
            data['#mainApp'].used.types = ['Akademie věd ČR']

            Redraw('#mainApp',false,false)
        }
    },offset:'60%'}    );


    waypoints = $('#conclusion').waypoint({handler:function(direction) {
        if(direction === 'down') {
            data['#mainApp'].used.fields = data['#mainApp'].default.fields
            data['#mainApp'].used.types = data['#mainApp'].default.types

            Redraw('#mainApp',false,false)
        } else {
            data['#mainApp'].used.fields = data['#mainApp'].default.fields
            data['#mainApp'].used.types = ['Vysoké školy']

            Redraw('#mainApp',false,false)
        }
    },offset:'60%'}    );




    waypoints = $('#conclusion').waypoint({handler:function(direction) {
        if (direction === 'down') {
            $('#mConclusion').addClass('storyPast')
        } else {
            $('#mConclusion').removeClass('storyPast')
        }},offset:'17%'});

    return waypoints;
};

function getSizes() {
    sizes.screen = {};
    sizes.screen.height = $('.fullscreen').height();
    sizes.screen.width = $('.fullscreen').width();

    sizes.menu = {};
    sizes.menu.height = $('#menu').height();

    sizes.chart = {};
    sizes.chart.height = 0.8*sizes.screen.height;
    sizes.chart.width = 0.8*sizes.screen.height;// +50;

}

function MoveOn(selector) {
    $('html,body').animate({
        scrollTop: $('#' +selector).offset().top - 100
    })
};


function showModal(modal) {
    $('.modalBackground').fadeIn(200,function() {$('#' + modal).addClass('modalActive')});
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



 function fb_share() {
     //TODO add link and image
     window.open( 
        'http://www.facebook.com/sharer.php?s=100&p[title]=a title&p[summary]=a description &p[url]=http://www.linkhere.com&p[images][0]=http://www.linkhere.com/image.jpg',
        'facebook-share-dialog', 
        'width=626,height=436'
    ); 

  }
  