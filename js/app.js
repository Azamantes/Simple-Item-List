'use strict';

Object.copy = (data) => JSON.parse(JSON.stringify(data));
function cancel(event) {
	for (let key of Object.keys(this.$refs)) {
		this.$refs[key].value = '';
	}

	this.channel.$emit('close.cloud');
};

const App = new Vue({
	template: `
		<div id='app' class='noselect'>
			<div id='controls'>
				<vue-types ref='types'></vue-types>
				<input placeholder='Search...' @input='filterName'>
				<button @click='addElement'>Add item</button>
				<button @click='addType'>Add type</button>
				<label>
					<input type='checkbox' @change='showDesc' ref='config_desc'>
					Show descriptions
				</label>
			</div>
			<vue-items ref='table' :channel='channel'></vue-items>
			<div id='cloud' v-if='cloud'>
				<div id='fog'></div>
				<component
					id='cloud-component'
					:channel='channel'
					:is='currentComponent'
					:toChange='toChange'
					:image='image'
				></component>
			</div>
		</div>
	`,
	mounted() {
		window.addEventListener('keydown', event => {
			if (event.key === 'Escape') {
				this.$data.channel.$emit('close.cloud');
			}
		});
		this.$refs.table.$el.children[1].addEventListener('click', this.click);
		this.$refs.types.$el.addEventListener('change', this.filterType);
		this.$data.channel.$on('close.cloud', () => {
			this.$data.cloud = false;
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
		image: '',
	}),
	components: {
		$alert: {
			template: `
				<div>
					<h2>Alert</h2>
					<div class='form'>
						<h3 class='warning'>List of types is empty (at least 1 required).</h3>
						<div>
							<button @click='cancel'>OK</button>
						</div>
					</div>
				</div>
			`,
			props: ['channel'],
			methods: { cancel },
		},
		$image: {
			template: `
				<div class='magnified'>
					<img :src='image' width='500' height='500'></img>
				</div>
			`,
			props: ['channel', 'image'],
			data: () => ({ src: '' }),
		},
		$element: {
			template: `
				<div>
					<h2>{{ mode }} element</h2>
					<div class='form'>

						<h3 v-if='warn' class='warning'>
							This name is used already.
						</h3>
						<h3 v-else-if='invalid' class='warning'>
							Invalid name.
						</h3>

						<div>Name:
							<input ref='name'	@keydown.enter='commit' placeholder='name'>
						</div>
						<div>Quantity: <input ref='amount' type='number' min='0' step='1'
							pattern='^[0-9]+$' placeholder='sztuk' value='1'>
						</div>
						<div>Type: <vue-types ref='type'></vue-types></div>
						<div>Image: <input type='file' ref='image'></div>
						<div class='higher'>Description: <textarea ref='desc' placeholder='Description...'></textarea></div>
						<div>
							<button @click='cancel'>Cancel</button>
							<button @click='commit'>{{ mode }}</button>
						</div>
					</div>
				</div>
			`,
			props: ['channel', 'toChange'],
			created() {
				this.mode = (this.toChange === null) ? 'Add' : 'Update';
			},
			data: () => ({
				invalid: false,
				mode: '',
				warn: false,
			}),
			mounted() {
				if (this.toChange !== null) {
					this.$refs.name.value = this.toChange.name;
					this.$refs.amount.value = this.toChange.amount;
					this.$refs.type.$el.value = this.toChange.type;
					this.$refs.desc.value = this.toChange.desc;
				}

				this.$refs.name.focus();
			},
			methods: {
				commit() {
					const name = this.$refs.name.value;
					const amount = Math.abs(+this.$refs.amount.value);
					const type = this.$refs.type.$el.value;
					const desc = this.$refs.desc.value;
					const $image = this.$refs.image.files[0];
					const image = $image ? $image.path : '';

					(this.toChange === null
						? this.add(name, amount, type,  desc, image)
						: this.change(name, amount, type, desc, image)
					);

					store.set('list', list);
					if (!this.$data.warn && !this.$data.invalid) {
						this.channel.$emit('close.cloud');
					}
				},
				add(name, amount, type, desc, image) {
					if (!name) {
						this.$data.invalid = true;
						return;
					}

					this.$data.invalid = false;
					this.$data.warn = list.some(item => (item.name === name));
					!this.$data.warn && list.push({
						name,
						amount,
						type,
						desc,
						image,
						visible: true,
					});
				},
				change(name, amount, type,  desc, image) {
					const $ = this.toChange;
					if ($.name !== name) {
						let i = list.length;
						while (i--) {
							if (list[i] === $) {
								continue;
							}
							if (list[i].name === name) {
								this.$data.warn = true;
								return;
							}
						}
					}

					if ($.name !== name) $.name = name;
					if ($.amount !== amount) $.amount = amount;
					if ($.type !== type) $.type = type;
					if ($.desc !== desc) $.desc = desc;
					if ($.image !== image) $.image = image;
				},
				cancel(event) {
					this.channel.$emit('done');
					cancel.call(this, event);
				},
			},
		},
		$type: {
			template: `
				<div>
					<h2>Add type</h2>
					<div class='form'>
						<h3 v-if='empty' class='warning'>
							Name is empty.
						</h3>
						<h3 v-else-if='exists' class='warning'>
							This type already exists.
						</h3>
						<div>Name: <input ref='name' v-on:keydown.enter='add' placeholder='name'></div>
						<div>
							<button @click='cancel'>Cancel</button>
							<button @click='add'>Add</button>
						</div>
					</div>
				</div>
			`,
			props: ['channel'],
			data: () => ({
				empty: false,
				exists: false,
			}),
			mounted() {
				this.$refs.name.focus();	
			},
			methods: {
				add(event) {
					const name = this.$refs.name.value;
					if (this.$data.empty = !name) {
						return;
					}
					if (this.$data.exists = types.includes(name)) {
						return;
					}

					types.push(name);
					types.sort();
					store.set('types', types);
					this.channel.$emit('close.cloud');
				},
				cancel,
			},
		},
	},
	methods: {
		showDesc(event) {
			config.showDescription = event.target.checked;
			store.set('config', config);
		},
		click(event) {
			const $ = event.target;
			const $$ = $.parentNode;
			if ($$.tagName === 'TR' && $$.firstElementChild === $) {
				this.$data.toChange = list.find(item => (item.name === $.textContent)) || null;
				this.$data.currentComponent = '$element';
				this.$data.cloud = true;
			} else if ($.tagName === 'IMG') {
				this.$data.image = $.src;
				this.$data.currentComponent = '$image';
				this.$data.cloud = true;
			}
		},
		changeElement(event) {
		},
		addElement(event) {
			this.$data.currentComponent = types.length ? '$element' : '$alert';
			this.$data.cloud = true;
		},
		addType(event) {
			this.$data.currentComponent = '$type';
			this.$data.cloud = true;
		},
		filterType(event) {
			this.$data.channel.$emit('filter', 'type', event.target.value);
		},
		filterName(event) {
			this.$data.channel.$emit('filter', 'name', event.target.value);
		},
	},
});