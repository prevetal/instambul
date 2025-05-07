WW = window.innerWidth || document.clientWidth || document.getElementsByTagName('body')[0].clientWidth
WH = window.innerHeight || document.clientHeight || document.getElementsByTagName('body')[0].clientHeight
BODY = document.getElementsByTagName('body')[0]


document.addEventListener('DOMContentLoaded', function() {
	var selectedRoutes = []


	// Reviews slider
	const reviewsSliders = [],
		reviews = document.querySelectorAll('.reviews .swiper')

	reviews.forEach((el, i) => {
		el.classList.add('reviews_s' + i)

		let options = {
			loop: true,
			loopAdditionalSlides: 1,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			lazy: true,
			breakpoints: {
				0: {
					spaceBetween: 20,
					slidesPerView: 1,
					autoHeight: true
				},
				768: {
					spaceBetween: 20,
					slidesPerView: 2
				},
				1024: {
					spaceBetween: 40,
					slidesPerView: 2
				},
				1280: {
					spaceBetween: 65,
					slidesPerView: 3
				}
			}
		}

		reviewsSliders.push(new Swiper('.reviews_s' + i, options))
	})


	// Accordion
	$('body').on('click', '.accordion .accordion_item .head', function(e) {
		e.preventDefault()

		let item = $(this).closest('.accordion_item'),
			accordion = $(this).closest('.accordion')

		if (item.hasClass('active')) {
			item.removeClass('active').find('.data').slideUp(300)
		} else {
			accordion.find('.accordion_item').removeClass('active')
			accordion.find('.data').slideUp(300)

			item.addClass('active').find('.data').slideDown(300)
		}
	})


	// Timer
	$('.timer .val').each(function () {
		$(this).countdown($(this).data('date'), function (event) {
			event.strftime('%D').startsWith("0")
				? $(this).find('.days span').text(event.strftime('%D').slice(1))
				: $(this).find('.days span').text(event.strftime('%D'))

			$(this).find('.hours').text(event.strftime('%H'))
			$(this).find('.minutes').text(event.strftime('%M'))
			$(this).find('.seconds').text(event.strftime('%S'))
		})
	})


	// Fancybox
	Fancybox.defaults.autoFocus = false
	Fancybox.defaults.trapFocus = false
	Fancybox.defaults.dragToClose = false
	Fancybox.defaults.placeFocusBack = false
	Fancybox.defaults.l10n = {
		CLOSE: 'Закрыть',
		NEXT: 'Следующий',
		PREV: 'Предыдущий',
		MODAL: 'Вы можете закрыть это модальное окно нажав клавишу ESC'
	}

	Fancybox.defaults.tpl = {
		closeButton: '<button data-fancybox-close class="f-button is-close-btn" title="{{CLOSE}}"><svg><use xlink:href="images/sprite.svg#ic_close"></use></svg></button>',

		main: `<div class="fancybox__container" role="dialog" aria-modal="true" aria-label="{{MODAL}}" tabindex="-1">
			<div class="fancybox__backdrop"></div>
			<div class="fancybox__carousel"></div>
			<div class="fancybox__footer"></div>
		</div>`,
	}


	const packagesFixPrices = {
		3: 5190,
		4: 6990,
		6: 9990
	}


	// Modals
	$('.modal_btn').click(function(e) {
		e.preventDefault()

		var routeIndex = null,
			isPackage = false,
			limit = 1

		if ($(this).attr('data-route-index') !== undefined) {
			routeIndex = $(this).attr('data-route-index')
		}

		if ($(this).attr('data-limit') !== undefined) {
			limit = $(this).attr('data-limit')
			isPackage = true
		}

		Fancybox.close()

		Fancybox.show([{
			src: document.getElementById(e.target.getAttribute('data-modal')),
			type: 'inline'
		}], {
			on: {
				reveal: () => {
					// Reset selected array
					selectedRoutes = []

					// Reset count
					$('.buy_modal .modal_desc .count .selected').text('0')
					$('.buy_modal .modal_desc .count .total').text(limit)

					// Reset inputs
					$('.buy_modal .items label input').prop('checked', false)
					$('.buy_modal .items label input').attr({ disabled: false, checked: false })

					// Disable next button
					$('#buy_modal .next_btn').attr('disabled', true)

					// One route modal
					if (routeIndex !== null) {
						let label = $('.buy_modal .items label').eq(routeIndex),
							input = label.find('input'),
							routePrice = input.data('price'),
							totalPrice = 0

						selectedRoutes.push({
							name: label.find('.name').text(),
							price: routePrice
						})

						// Set count
						$('.buy_modal .modal_desc .count .selected').text(limit)

						// Disable others
						$('.buy_modal .items label input').attr('disabled', true)
						input.attr('checked', true)
						input.prop('checked', true)

						// Set selected routes in second modal
						$('.buy_modal .selected_routes span').remove()

						selectedRoutes.forEach(el => {
							$('.buy_modal .selected_routes').append(`<span>${el.name}</span>`)
						})

						// Set total price
						selectedRoutes.forEach(el => totalPrice += el.price)

						$('.buy_modal .price .val span').text(totalPrice)

						// Enable next button
						$('.buy_modal .next_btn').attr('disabled', false)
					}


					// Routes package
					if (isPackage) {
						// Reset total price
						$('#buy_modal .price .val span').text('0')

						$('.buy_modal .items label').on('click.package', function (e) {
							if (e.target.nodeName === 'LABEL') {
								if (selectedRoutes.length >= parseInt(limit) && !$(this).find('input').prop('checked')) {
									return false
								}

								// Reset total price
								let totalPrice = 0

								if ($(this).find('input').prop('checked')) {
									// Romeve from selected routes
									selectedRoutes = selectedRoutes.filter(route => route.name !== $(this).find('.name').text())
								} else {
									//Add to selected routes
									let routePrice = $(this).find('input').data('price')

									selectedRoutes.push({
										name: $(this).find('.name').text(),
										price: routePrice
									})
								}

								// Set count
								$('.buy_modal .modal_desc .count .selected').text(selectedRoutes.length)

								// Set selected routes in second modal
								$('.buy_modal .selected_routes span').remove()

								selectedRoutes.forEach(el => {
									$('.buy_modal .selected_routes').append(`<span>${el.name}</span>`)
								})

								// Set total price
								selectedRoutes.length in packagesFixPrices
									? totalPrice = packagesFixPrices[selectedRoutes.length]
									: selectedRoutes.forEach(el => totalPrice += el.price)

								$('.buy_modal .price .val span').text(totalPrice)

								// Enable next button
								selectedRoutes.length == limit
									? $('#buy_modal .next_btn').attr('disabled', false)
									: $('#buy_modal .next_btn').attr('disabled', true)
							}
						})
					}
				},
				close: () => {
					// Delete event handler
					$('.buy_modal .items label').off('click.package');
				}
			}
		})
	})


	$('.modal .close_btn').click(function(e) {
		e.preventDefault()

		Fancybox.close()
	})


	// Zoom images
	Fancybox.bind('.fancy_img', {
		Image: {
			zoom: false
		},
		Thumbs: {
			autoStart: false
		}
	})


	// Mob. menu
	$('.mob_header .mob_menu_btn').click((e) => {
		e.preventDefault()

		$('.mob_header .mob_menu_btn').toggleClass('active')
		$('body').toggleClass('lock')
		$('header').toggleClass('show')

		$('.mob_header .mob_menu_btn').hasClass('active')
			? $('.overlay').fadeIn(300)
			: $('.overlay').fadeOut(300)
	})


	// Phone input mask
	const phoneInputs = document.querySelectorAll('input[type=tel]')

	if (phoneInputs) {
		phoneInputs.forEach(el => {
			IMask(el, {
				mask: '+{7} (000) 000-00-00',
				lazy: true
			})
		})
	}


	// Smooth scrolling to anchor
	const scrollBtns = document.querySelectorAll('.scroll_btn')

	if (scrollBtns) {
		scrollBtns.forEach(element => {
			element.addEventListener('click', e => {
				e.preventDefault()

				let anchor = element.getAttribute('data-anchor')

				document.getElementById(anchor).scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				}, 1000)
			})
		})
	}


	// Select package
	$('.buy_block .packages label').click(function(e) {
		if (e.target.nodeName === 'LABEL') {
			let price = $(this).find('input').data('price'),
				limit = $(this).find('input').data('limit')

			$('.buy_block .buy .price .val span').text(price)
			$('.buy_block .buy .btn').attr('data-limit', limit)
		}
	})
})



window.addEventListener('resize', function () {
	WH = window.innerHeight || document.clientHeight || BODY.clientHeight

	let windowW = window.outerWidth

	if (typeof WW !== 'undefined' && WW != windowW) {
		// Overwrite window width
		WW = window.innerWidth || document.clientWidth || BODY.clientWidth


		// Mob. version
		if (!fakeResize) {
			fakeResize = true
			fakeResize2 = false

			document.getElementsByTagName('meta')['viewport'].content = 'width=device-width, initial-scale=1, maximum-scale=1'
		}

		if (!fakeResize2) {
			fakeResize2 = true

			if (windowW < 375) document.getElementsByTagName('meta')['viewport'].content = 'width=375, user-scalable=no'
		} else {
			fakeResize = false
			fakeResize2 = true
		}
	}
})