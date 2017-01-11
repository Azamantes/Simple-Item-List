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
			if (this.item.amount > 0) {
				this.item.amount -= +value || 1;
			}

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
			<option v-for='type of types' :value='type'>
				{{ type }}
			</option>
		</select>
	`,
	data: () => ({ types }),
});
Vue.component('vue-items', {
	template: `
		<table>
			<thead @click='$sort'>
				<th>Name</th>
				<th>Amount</th>
				<th>Type</th>
				<th>Actions</th>
				<th v-if='config.showDescription'>Opis</th>
			</thead>
			<tbody>
				<vue-item v-for='item of list'
					:channel='channel'
					:item='item'
				></vue-item>
			</tbody>
		</table>
	`,
	props: ['channel'],
	created() {
		this.channel.$on('filter', (prop, value) => {
			if (!(prop in this.$data.filter)) {
				return console.error(`Invalid filter property (${prop}) : (${value})`);
			}

			this.$data.filter[prop] = value;
			this.$filter();
		});
	},
	data: () => ({
		config,
		list,
		filter: {
			type: '',
			name: '',
		},
		sort: {
			allowed: /^(name|amount|type)$/,
			asc: true,
			last: null,
		},
	}),
	methods: {
		$filter() {
			const { name, type } = this.$data.filter;
			list.forEach(item => {
				item.visible = (
					(name ? item.name.includes(name) : true) &&
					(type ? (item.type === type) : true)
				);
			});
		},
		$sort(event) {
			const $ = event.target;
			const prop = $.textContent.toLowerCase();
			const { sort } = this.$data;
			if (!sort.allowed.test(prop)) {
				return;
			}

			const bool = sort.asc = (sort.last === $) ? !sort.asc : true;
			this.$data.list.sort(({ [prop]: a }, { [prop]: b }) => (
				bool ? a > b : a < b
			));
			sort.last = $;
		},
	},
});
Vue.component('vue-item', {
	template: `
		<tr @click='onClick' v-show='item.visible'>
			<td>{{ item.name}}</td>
			<td>( {{ item.amount }} )</td>
			<td>{{ item.type }}</td>
			<td>
				<button data-click='plus'>Dodaj</button>
				<input placeholder='sztuk' ref='input'>
				<button data-click='minus'>Odejmij</button>
				<button data-click='remove'>Usuń</button>
			</td>
			<td v-if='config.showDescription'>
				{{item.desc || 'Brak opisu...'}}
			</td>
		</tr>
	`,
	props: ['channel', 'item'],
	methods: { onClick },
	data: () => ({ config }),
});