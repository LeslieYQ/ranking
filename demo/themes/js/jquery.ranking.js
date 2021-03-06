(function($) {
	var rankingUl = null,
		topSteps = null,
		ranking = null,
		rankingData = null,
		rankingArea = null;

	var init = function(node) {
		node.append('<div class="ranking-content"></div>');
		node.find('.ranking-content').append('<div class="ranking-detail"></div>');
		node.find('.ranking-detail').append('<div id="ranking-details-content"></div>');
		rankingUl = $('#ranking-details-content');
		ranking = rankingUl.parent();
		rankingArea = rankingUl.offset().top + 460;
		console.log(rankingArea);
	};

	var _populate = function(data, tplHtml) {
		var tpl = Handlebars.compile(tplHtml);
		this.append(tpl(data));
	};

	var _bindScroll = function(event) {
		event.preventDefault();
		event.stopImmediatePropagation();
		var width = rankingUl.height(),
			scrollWidth = $(event.target).height()
			scrollLeft = $(event.target).scrollTop(),
			begin = rankingUl.find('div.ranking-item').length;
		_isViewable(rankingUl, rankingArea);
		if (width - scrollLeft - scrollWidth < 100) {
			ranking.unbind("scroll");
			if (begin < 990) {
				_render(rankingData);
			} else if (begin >= 990 && begin < 1000) {
				_render(rankingData);
			}
		};
	};

	var _isViewable = function(nodeID, area) { console.log(area);
		$.each(nodeID.children('div:has(.initial-render)'), function(index, val) {
			/* iterate through array or object */
			var thisNode = $(this),
				thisBody = document.body || document.documentElement,
				thisStyle = thisBody.style,
				transitionEndEvent = 'webkitTransitionEnd oTransitionEnd transitionend',
				cssTransitionsSupported = thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.OTransition !== undefined || thisStyle.transition !== undefined;
			if (thisNode.offset().top < area) {
				if (cssTransitionsSupported) {
					thisNode.find('div.ranking-graph-render').removeClass('initial-render');
					thisNode.find('p.ranking-steps').removeClass('initial-render');
				} else {
					var divTop = thisNode.find('div.ranking-graph-render').attr('data-top'),
						divHeight = thisNode.find('div.ranking-graph-render').attr('data-height');
					thisNode.find('div.ranking-graph-render').css("top", "100%");
					thisNode.find('div.ranking-graph-render').width(0);
					thisNode.find('p.ranking-steps').css("left", "100%");
					thisNode.find('div.ranking-graph-render').removeClass('initial-render').animate({
							left: divTop + '%',
							width: divHeight + '%'
						},
						1000);
					thisNode.find('p.ranking-steps').removeClass('initial-render').animate({
						left: divTop + '%'
					}, 1000);
				};
				var toNumber = parseInt(thisNode.find('p.ranking-steps').attr('data-number'));
				thisNode.find('p.ranking-steps').countTo({
					from: 0,
					to: toNumber,
					speed: 1000,
					refreshInterval: 50
				});
			};
		});
	};

	var _render = function(data) {
		var liHtml = [],
			tpl = null,
			tencentImageUrl = 'http://app1101081259.qzone.qzoneapp.com/lepao-image/userHeadImage/';
			liHtml.push('<div class="ranking-item"><ul class="ranking-list">');
			liHtml.push('<li><p class="ranking-number {{topThree}}">{{rankId}}</p><p class="ranking-number ranking-name {{topThree}}">{{nickName}}</p></li>');
			liHtml.push('<li><div class="ranking-avatar"><img src="{{avatar}}" class="ranking-avatar-image"><div class="ranking-avatar-background"></div></div></li>');
			liHtml.push('<li><div class="ranking-graph-steps"><div class="ranking-graph-render initial-render" data-height="{{percent}}" data-top="{{topPercent}}" style="width:{{percent}}%;"></div><p class="ranking-steps initial-render" data-number="{{steps}}" style="left:{{percent}}%">0</p></div></li>');
			liHtml.push('</ul></div>');
			rankingUl.height(rankingUl.height() + 82 * data.length);

		for (var i = 0; i <= data.length - 1; i++) {
			var randerData = {
				percent: 100,
				topPercent: 0,
				steps: null,
				crownImage: '',
				avatar: 'themes/images/default.png',
				rankId: null,
				nickName: null,
				topThree: ''
			};
			tpl = liHtml.join('');
			randerData.steps = data[i].steps;
			randerData.nickName = data[i].nickName;
			randerData.rankId = data[i].id;
			if (data[i].id <= 3) {
				randerData.topThree = 'ranking-top-three';
				randerData.rankId = 'NO.' + randerData.rankId;
			};
			if (data[i].id == 1) {
				randerData.crownImage = 'ranking-crown-image';
				topSteps = randerData.steps;
			} else {
				randerData.percent = (randerData.steps / topSteps).toFixed(2) * 100;
				randerData.topPercent = 100 - randerData.percent;
			};
			if (data[i].headImage) {
				if (data[i].headImage.indexOf('http') == 0) {
					randerData.avatar = data[i].headImage;
				} else if (data[i].headImage.indexOf('.') > 0 && data[i].headImage.length > 0) {
					randerData.avatar = tencentImageUrl + data[i].headImage;
				};
			};

			_populate.apply(rankingUl, [randerData, tpl]);
		};
		ranking.bind("scroll", _bindScroll);
	};

	$.fn.ranking = function(options) {
		options = options || {
			data:null,
			horizontalScroll:false
		};
		if (!rankingUl) {
			init(this);
		};

		rankingData = options.data;

		_render(rankingData);

		_isViewable(rankingUl, rankingArea);

	};
})(jQuery)