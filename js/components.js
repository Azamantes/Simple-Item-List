function onClick(event) {
	if (event.target.tagName !== 'BUTTON') {
		return;
	}

	const value = this.$refs.input.value;
	switch (event.target.dataset.click) {
		case 'plus': {
			this.item.amount += +value || 1;
			store.set('list', list);
			break;
		}
		case 'minus': {
			this.item.amount -= +value || 1;
			store.set('list', list);
			break;
		}
		case 'remove': {
			list.splice(list.indexOf(this.item), 1);
			store.set('list', list);
			break;
		}
	}

	this.$refs.input.value = '';
}

Vue.component('vue-types', {
	template: `
		<select>
			<option
				v-for='type of types'
				v-text='type'
				:value='type'
			></option>
		</select>
	`,
	data: () => ({ types }),
});
Vue.component('vue-items', {
	template: `
		<div id='list' @click='click'>
			<ol>
				<vue-item v-for='item of list'
					:channel='channel'
					:item='item'
				></vue-item>
			</ol>
		</div>
	`,
	props: ['channel', 'click'],
	data: () => ({ list }),
});
Vue.component('vue-item', {
	template: `
		<li @click='onClick' v-show='visible'>
			<span>{{ item.name}}</span>
			<span>( {{ item.amount }} )</span>
			<span>{{ item.type }}</span>

			<button data-click='plus'>Dodaj</button>
			<input
				type='number'
				placeholder='sztuk'
				min='0'
				step='1'
				pattern="^[0-9]+$"
				ref='input'
			>
			<button data-click='minus'>Odejmij</button>
			<button data-click='remove'>Usuń</button>
			<div v-if='config.showDescription'>
				{{item.desc || 'Brak opisu...'}}
			</div>
		</li>
	`,
	props: ['channel', 'item'],
	created() {
		this.channel.$on('filter', this.show);
	},
	beforeDestroyed() {
		this.channel.$off('filter', this.show);
	},
	methods: {
		onClick,
		show(text) {
			if (text) {
				this.$data.visible = this.item.name.indexOf(text) !== -1;
			} else this.$data.visible = true;
		},
	},
	data: () => ({
		config: config,
		visible: true,
	}),
});