var sizes = {}

var waypoints;


function loadJS() {

    sortMenudata();

    waypoints = waypointing();
    
    getSizes();

    DrawAllCharts();

    checkResolution();

}

function checkResolution() {
    w = $(window).width()
    if (w<1201) {
        showModal('modRozliseni')
    }
}

function waypointing() {
    function activatefix(selector) {
        $('.fixactive').removeClass('fixactive');
        $(selector).addClass('fixactive');
    };
    

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

    waypoints = $('#LifeSocial').waypoint(function(direction) {
        if(direction === 'down') {
            $('#mLifeSocial').addClass('storyPast')
            data['#mainApp'].used.fields = ['Společenské vědy','Přírodní vědy']
            data['#mainApp'].used.types = ['Vysoké školy']

            Redraw('#mainApp',false,false)
        } else {
            $('#mLifeSocial').removeClass('storyPast')

            data['#mainApp'].used.fields = data['#mainApp'].default.fields
            data['#mainApp'].used.types = data['#mainApp'].default.types

            Redraw('#mainApp',false,false)
        }
    },
     {offset:'17%'}
    );

    waypoints = $('#conclusion').waypoint({handler:function(direction) {
        if (direction === 'down') {
            activatefix('#thanks')
        } else {
            activatefix('#app')
        }}});

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
    sizes.chart.height = 0.7*sizes.screen.height;
    sizes.chart.width = 0.7*sizes.screen.height;// +50;

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
  