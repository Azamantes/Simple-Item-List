'use strict';

function cancel(event) {
	for (let node of Object.entries(this.$refs)) {
		node.value = '';
	}
	clearTimeout(this.$data.timer);
	this.channel.$emit('close.cloud');
};
function setTimer() {
	setTimeout(() => {
		this.$data.info = this.$data.warn = false;
		if ('invalid' in this.$data) {
			this.$data.invalid = false;
		}
	}, 1e3);
};
const getData = () => ({
	timer: 0,
	info: false,
	warn: false,
});

const App = new Vue({
	template: `
		<div id='app' class='noselect'>
			<div id='controls'>
				<vue-types ref='type'></vue-types>
				<input placeholder='Czego szukasz?' ref='filter' @input='filter'>
				<button @click='addElement'>Dodaj element</button>
				<button @click='addType'>Dodaj typ</button>
				<label><input type='checkbox' @change='showDesc' ref='config_desc'>Pokaż opisy</label>
			</div>
			<vue-items :click='changeElement' :channel='channel'></vue-items>
			<div id='cloud' v-if='cloud'>
				<div id='fog'></div>
				<component
					id='cloud-component'
					:channel='channel'
					:is='currentComponent'
					:toChange='toChange'
				></component>
			</div>
		</div>
	`,
	mounted() {
		this.$data.channel.$on('close.cloud', () => {
			this.$data.cloud = false;
		});
		this.$data.channel.$on('change', (event) => {
			this.change(event);
		});
		this.$data.channel.$on('done', () => {
			this.$data.toChange = null;
		});

		this.$refs.config_desc.checked = config.showDescription;
	},
	data: () => ({
		channel: new Vue(),
		currentComponent: '',
		cloud: false,
		toChange: null,
	}),
	components: {
		$alert: {
			template: `
				<div>
					<h1>Alert</h1>
					<div class='form'>
						<h3 class='warning'>
							Lista typów jest pusta (wymagane >= 1).
						</h3>
						<div>
							<button @click='cancel'>OK</button>
						</div>
					</div>
				</div>
			`,
			props: ['channel'],
			methods: { cancel },
		},
		$element: {
			template: `
				<div>
					<h1>{{ mode }} element</h1>
					<div class='form'>

						<h3 v-if='warn' class='warning'>
							Element o takiej nazwie juz istnieje.
						</h3>
						<h3 v-else-if='invalid' class='warning'>
							Niepoprawna nazwa.
						</h3>
						<h3 v-else-if='info' class='info'>
							Dodano nowy typ.
						</h3>

						<div>Nazwa: <input ref='name' placeholder='nazwa przedmiotu'></div>
						<div>Sztuk: <input ref='amount' type='number' min='0' step='1'
							pattern='^[0-9]+$' placeholder='sztuk' value='1'>
						</div>
						<div>Typ: <vue-types ref='type'></vue-types></div>
						<div class='higher'>Opis: <textarea ref='desc' placeholder='Opis przedmiotu...'></textarea></div>
						<div>
							<button @click='cancel'>{{ done }}</button>
							<button @click='commit'>{{ mode }}</button>
						</div>
					</div>
				</div>
			`,
			props: ['channel', 'toChange'],
			created() {
				this.mode = (this.toChange === null) ? 'Dodaj' : 'Zmień';
			},
			data: () => Object.assign({}, getData(), {
				invalid: false,
				mode: '',
				done: 'Anuluj',
			}),
			mounted() {
				if (this.toChange !== null) {
					this.$refs.name.value = this.toChange.name;
					this.$refs.amount.value = this.toChange.amount;
					this.$refs.type.value = this.toChange.type;
					this.$refs.desc.value = this.toChange.desc;
				}

				this.focus();
			},
			methods: {
				commit() {
					clearTimeout(this.$data.timer);
					const name = this.$refs.name.value;
					const amount = Math.abs(+this.$refs.amount.value);
					const type = this.$refs.type.$el.value;
					const desc = this.$refs.desc.value;
					
					(this.toChange === null
						? this.add(name, amount, type,  desc)
						: this.change(name, amount, type, desc)
					);

					store.set('list', list);
				},
				add(name, amount, type,  desc) {
					if (!name) {
						this.$data.invalid = true;
						this.setTimer();
						return;
					}

					this.$data.warn = list.some(item => (item.name === name));
					this.$data.info = !this.$data.warn;
					this.setTimer();
					if (!this.$data.warn) {
						list.push({ name, amount, type, desc });
						this.$data.done = 'OK';
					}
				},
				change(name, amount, type,  desc) {
					const $ = this.toChange;

					if ($.name !== name) {
						let i = list.length;
						while (i--) {
							if (list[i] === $) {
								continue;
							}
							if (list[i].name === name) {
								this.$data.warn = true;
								this.$data.done = 'Anuluj';
								this.setTimer();
								return;
							}
						}
					}

					if ($.name !== name) $.name = name;
					if ($.amount !== amount) $.amount = amount;
					if ($.type !== type) $.type = type;
					if ($.desc !== desc) $.desc = desc;

					this.$data.done = 'OK';
				},
				showMessage() {

				},
				cancel(event) {
					this.channel.$emit('done');
					cancel.call(this, event);
				},
				setTimer,
				focus() {
					this.$refs.name.focus();
				},
			},
		},
		$type: {
			template: `
				<div>
					<h1>Dodaj typ</h1>
					<div class='form'>
						<h3 v-if='warn' class='warning'>
							Ten typ już istnieje.
						</h3>
						<h3 v-if='info' id='info'>
							Dodano nowy typ.
						</h3>
						<div>Nazwa: <input ref='name'></div>
						<div>
							<button @click='cancel'>Anuluj</button>
							<button @click='add'>Dodaj</button>
						</div>
					</div>
				</div>
			`,
			props: ['channel'],
			data: getData,
			mounted() {
				this.focus();	
			},
			methods: {
				add(event) {
					const name = this.$refs.name.value;

					this.$data.warn = types.includes(name)
					this.$data.info = !this.$data.warn;
					this.setTimer();
					if (this.$data.warn) {
						return;
					}

					types.push(name);
					store.set('types', types);
				},
				cancel,
				setTimer,
				focus() {
					this.$refs.name.focus();
				},
			},
		},
	},
	methods: {
		showDesc(event) {
			config.showDescription = event.target.checked;
			store.set('config', config);
		},
		changeElement(event) {
			const $ = event.target;
			const $$ = $.parentNode;
			if ($$.tagName !== 'LI' || $$.firstElementChild !== $) {
				return;
			}

			this.$data.toChange = list.find(item => (item.name === $.textContent)) || null;
			this.$data.currentComponent = '$element';
			this.$data.cloud = true;
		},
		addElement(event) {
			this.$data.currentComponent = types.length ? '$element' : '$alert';
			this.$data.cloud = true;			
		},
		addType(event) {
			this.$data.currentComponent = '$type';
			this.$data.cloud = true;
		},
		filter(event) {
			this.$data.channel.$emit('filter', event.target.value);
		},
	},
});