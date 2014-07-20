var PageTransitions = (function() {

  var TransitionTypes = {
    transitionIn: 'transitionIn',
    transitionOut: 'transitionOut',
  }

  var TransitionEvents = {
    transitionStart: 'transitionStart',
    transitionEnd: 'transitionEnd'
  }

  var $main = $('#pt-main'),
    $pages = $main.children('div.pt-page'),
    $iterate = $('#iterateEffects'),
    animcursor = 1,
    pagesCount = $pages.length,
    current = '',
    isAnimating = false,
    endCurrPage = false,
    endNextPage = false,
    animEndEventNames = {
      'WebkitAnimation': 'webkitAnimationEnd',
      'OAnimation': 'oAnimationEnd',
      'msAnimation': 'MSAnimationEnd',
      'animation': 'animationend'
    },
    // animation end event name
    animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],
    // support css animations
    support = Modernizr.cssanimations;

  function init() {

    $pages.each(function() {
      var $page = $(this);
      $page.data('originalClassList', $page.attr('class'));
    });

    $('div[data-first-page]').addClass('pt-page-current');
    current = $('div[data-first-page]').attr('id');

    $('.btn-next').on('click', function(ev) {
      ev.preventDefault();
      switchPage({
        showPage: 'options-screen',
        animation: TransitionTypes.transitionIn
      });
    });

    $('.btn-previous').on('click', function(ev) {
      ev.preventDefault();
      switchPage({
        showPage: 'game-menu',
        animation: TransitionTypes.transitionOut
      });
    });

  }

  function switchPage(options) {
    var animation = (options.animation) ? options.animation : options;

    if (isAnimating) {
      return false;
    }

    isAnimating = true;

    var $currPage = $('#' + current);
    $currPage.trigger(TransitionEvents.transitionStart);

    if (options.showPage) {
      current = options.showPage;
    }

    var $nextPage = $('#' + current).addClass('pt-page-current'),
      outClass = '',
      inClass = '';

    switch (animation) {
      case TransitionTypes.transitionIn:
        outClass = 'pt-page-rotateRightSideFirst';
        inClass = 'pt-page-moveFromRight pt-page-delay200 pt-page-ontop';
        break;
      case TransitionTypes.transitionOut:
        outClass = 'pt-page-rotateLeftSideFirst';
        inClass = 'pt-page-moveFromLeft pt-page-delay200 pt-page-ontop';
        break;
    }

    $currPage.addClass(outClass).on(animEndEventName, function() {
      $currPage.off(animEndEventName);
      endCurrPage = true;
      if (endNextPage) {
        onEndAnimation($currPage, $nextPage);
      }
    });

    $nextPage.addClass(inClass).on(animEndEventName, function() {
      $nextPage.off(animEndEventName);
      endNextPage = true;
      if (endCurrPage) {
        onEndAnimation($currPage, $nextPage);
      }
    });

    if (!support) {
      onEndAnimation($currPage, $nextPage);
    }

  }

  function onEndAnimation($outpage, $inpage) {
    endCurrPage = false;
    endNextPage = false;
    resetPage($outpage, $inpage);
    isAnimating = false;
    $inpage.trigger(TransitionEvents.transitionEnd);
  }

  function resetPage($outpage, $inpage) {
    $outpage.attr('class', $outpage.data('originalClassList'));
    $inpage.attr('class', $inpage.data('originalClassList') + ' pt-page-current');
  }

  $(function() {
    init();
  });

  function goToScreen(screen) {
    switchPage({
      showPage: screen.name,
      animation: TransitionTypes.transitionIn
    })
  }

  return {
    init: init,
    switchPage: switchPage,
    goToScreen: goToScreen,
    TransitionEvents: TransitionEvents,
    TransitionTypes: TransitionTypes
  };

})();
