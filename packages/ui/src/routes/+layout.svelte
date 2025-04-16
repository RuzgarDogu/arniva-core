<script>
	/** @type {{ data: import('./$types').LayoutData, children: import('svelte').Snippet }} */
	let { children, data } = $props();
	import '$lib/styles/app.scss';
	import '../styles/main.scss';

	import {
		Layout,
		Aside,
		Main,
		Navbar,
		Content,
		Sidenav,
		Dropdown,
		Button,
		DropdownContent,
		Topnav,
		Tabnav
	} from '$lib';
</script>

<Layout theme={data.theme}>
	<Aside>
		<Sidenav>
			{#snippet dropdown()}
				<Dropdown>
					<Button dropdown size="small" square color="transparent">
						<svg
							width="18px"
							height="18px"
							viewBox="0 0 32 32"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
								id="SVGRepo_tracerCarrier"
								stroke-linecap="round"
								stroke-linejoin="round"
							></g><g id="SVGRepo_iconCarrier">
								<path
									stroke="currentColor"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13.905 3.379A.5.5 0 0114.39 3h3.22a.5.5 0 01.485.379l.689 2.757a.515.515 0 00.341.362c.383.126.755.274 1.115.443a.515.515 0 00.449-.003l2.767-1.383a.5.5 0 01.577.093l2.319 2.319a.5.5 0 01.093.577l-1.383 2.767a.515.515 0 00-.003.449c.127.271.243.549.346.833.053.148.17.265.319.315l2.934.978a.5.5 0 01.342.474v3.28a.5.5 0 01-.342.474l-2.934.978a.515.515 0 00-.32.315 9.937 9.937 0 01-.345.833.515.515 0 00.003.449l1.383 2.767a.5.5 0 01-.093.577l-2.319 2.319a.5.5 0 01-.577.093l-2.767-1.383a.515.515 0 00-.449-.003c-.271.127-.549.243-.833.346a.515.515 0 00-.315.319l-.978 2.934a.5.5 0 01-.474.342h-3.28a.5.5 0 01-.474-.342l-.978-2.934a.515.515 0 00-.315-.32 9.95 9.95 0 01-1.101-.475.515.515 0 00-.498.014l-2.437 1.463a.5.5 0 01-.611-.075l-2.277-2.277a.5.5 0 01-.075-.61l1.463-2.438a.515.515 0 00.014-.498 9.938 9.938 0 01-.573-1.383.515.515 0 00-.362-.341l-2.757-.69A.5.5 0 013 17.61v-3.22a.5.5 0 01.379-.485l2.757-.689a.515.515 0 00.362-.341c.157-.478.35-.94.573-1.383a.515.515 0 00-.014-.498L5.594 8.557a.5.5 0 01.075-.611l2.277-2.277a.5.5 0 01.61-.075l2.438 1.463c.152.091.34.094.498.014a9.938 9.938 0 011.382-.573.515.515 0 00.342-.362l.69-2.757z"
								></path>
								<circle
									cx="16"
									cy="16"
									r="5"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
								></circle>
							</g></svg
						>
					</Button>
					<DropdownContent>
						<Button list label="Option A" color="transparent" />
						<Button list label="Option B" color="transparent" />
						<Button list label="Option C" color="transparent" />
					</DropdownContent>
				</Dropdown>
			{/snippet}
		</Sidenav>
	</Aside>
	<Main>
		<Navbar>
			<Topnav>
				{#snippet left()}
					<Button thin size="small" color="transparent">
						<svg
							width="16px"
							height="16px"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
								id="SVGRepo_tracurrentColorerCarrier"
								stroke-linecurrentcap="round"
								stroke-linejoin="round"
							></g><g id="SVGRepo_icurrentColoronCarrier">
								<path
									d="M21 2V22"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecurrentcap="round"
								></path>
								<path
									d="M17 7.5C17 6.56538 17 6.09808 16.799 5.75C16.6674 5.52197 16.478 5.33261 16.25 5.20096C15.9019 5 15.4346 5 14.5 5H5.5C4.56538 5 4.09808 5 3.75 5.20096C3.52197 5.33261 3.33261 5.52197 3.20096 5.75C3 6.09808 3 6.56538 3 7.5C3 8.43462 3 8.90192 3.20096 9.25C3.33261 9.47803 3.52197 9.66739 3.75 9.79904C4.09808 10 4.56538 10 5.5 10H14.5C15.4346 10 15.9019 10 16.25 9.79904C16.478 9.66739 16.6674 9.47803 16.799 9.25C17 8.90192 17 8.43462 17 7.5Z"
									stroke="currentColor"
									stroke-width="1.5"
								></path>
								<path
									d="M17 16.5C17 15.5654 17 15.0981 16.799 14.75C16.6674 14.522 16.478 14.3326 16.25 14.201C15.9019 14 15.4346 14 14.5 14H8.5C7.56538 14 7.09808 14 6.75 14.201C6.52197 14.3326 6.33261 14.522 6.20096 14.75C6 15.0981 6 15.5654 6 16.5C6 17.4346 6 17.9019 6.20096 18.25C6.33261 18.478 6.52197 18.6674 6.75 18.799C7.09808 19 7.56538 19 8.5 19H14.5C15.4346 19 15.9019 19 16.25 18.799C16.478 18.6674 16.6674 18.478 16.799 18.25C17 17.9019 17 17.4346 17 16.5Z"
									stroke="currentColor"
									stroke-width="1.5"
								></path>
							</g></svg
						>
						Hızlı Erişim
					</Button>
					<Button thin size="small" color="transparent">
						<svg
							width="16px"
							height="16px"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
								id="SVGRepo_tracurrentColorerCarrier"
								stroke-linecurrentcap="round"
								stroke-linejoin="round"
							></g><g id="SVGRepo_icurrentColoronCarrier">
								<path
									d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z"
									stroke="currentColor"
									stroke-width="1.5"
								></path>
								<path
									d="M8 12H16"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecurrentcap="round"
								></path>
								<path
									d="M8 8H16"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecurrentcap="round"
								></path>
								<path
									d="M8 16H13"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecurrentcap="round"
								></path>
							</g></svg
						>
						Kontrol Paneli
					</Button>
				{/snippet}
				{#snippet right()}
					<Button square color="transparent">
						<svg
							width="16px"
							height="16px"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
								id="SVGRepo_tracurrentColorerCarrier"
								stroke-linecurrentcap="round"
								stroke-linejoin="round"
							></g><g id="SVGRepo_icurrentColoronCarrier">
								<path
									d="M4.97883 9.68508C2.99294 8.89073 2 8.49355 2 8C2 7.50645 2.99294 7.10927 4.97883 6.31492L7.7873 5.19153C9.77318 4.39718 10.7661 4 12 4C13.2339 4 14.2268 4.39718 16.2127 5.19153L19.0212 6.31492C21.0071 7.10927 22 7.50645 22 8C22 8.49355 21.0071 8.89073 19.0212 9.68508L16.2127 10.8085C14.2268 11.6028 13.2339 12 12 12C10.7661 12 9.77318 11.6028 7.7873 10.8085L4.97883 9.68508Z"
									stroke="currentColor"
									stroke-width="1.5"
								></path>
								<path
									d="M22 12C22 12 21.0071 12.8907 19.0212 13.6851L16.2127 14.8085C14.2268 15.6028 13.2339 16 12 16C10.7661 16 9.77318 15.6028 7.7873 14.8085L4.97883 13.6851C2.99294 12.8907 2 12 2 12"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecurrentcap="round"
								></path>
								<path
									d="M22 16C22 16 21.0071 16.8907 19.0212 17.6851L16.2127 18.8085C14.2268 19.6028 13.2339 20 12 20C10.7661 20 9.77318 19.6028 7.7873 18.8085L4.97883 17.6851C2.99294 16.8907 2 16 2 16"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecurrentcap="round"
								></path>
							</g></svg
						>
					</Button>
					<Button square color="transparent">
						<svg
							width="16px"
							height="16px"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
								id="SVGRepo_tracurrentColorerCarrier"
								stroke-linecurrentcap="round"
								stroke-linejoin="round"
							></g><g id="SVGRepo_icurrentColoronCarrier">
								<path
									d="M4 18V6"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecurrentcap="round"
								></path>
								<path
									d="M20 6V18"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecurrentcap="round"
								></path>
								<path
									d="M12 10C16.4183 10 20 8.20914 20 6C20 3.79086 16.4183 2 12 2C7.58172 2 4 3.79086 4 6C4 8.20914 7.58172 10 12 10Z"
									stroke="currentColor"
									stroke-width="1.5"
								></path>
								<path
									d="M20 12C20 14.2091 16.4183 16 12 16C7.58172 16 4 14.2091 4 12"
									stroke="currentColor"
									stroke-width="1.5"
								></path>
								<path
									d="M20 18C20 20.2091 16.4183 22 12 22C7.58172 22 4 20.2091 4 18"
									stroke="currentColor"
									stroke-width="1.5"
								></path>
							</g></svg
						>
					</Button>
					<Button square color="transparent">
						<svg
							width="16px"
							height="16px"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
								id="SVGRepo_tracurrentColorerCarrier"
								stroke-linecurrentcap="round"
								stroke-linejoin="round"
							></g><g id="SVGRepo_icurrentColoronCarrier">
								<path
									d="M9 12C9 13.3807 7.88071 14.5 6.5 14.5C5.11929 14.5 4 13.3807 4 12C4 10.6193 5.11929 9.5 6.5 9.5C7.88071 9.5 9 10.6193 9 12Z"
									stroke="currentColor"
									stroke-width="1.5"
								></path>
								<path
									d="M14 6.5L9 10"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecurrentcap="round"
								></path>
								<path
									d="M14 17.5L9 14"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecurrentcap="round"
								></path>
								<path
									d="M19 18.5C19 19.8807 17.8807 21 16.5 21C15.1193 21 14 19.8807 14 18.5C14 17.1193 15.1193 16 16.5 16C17.8807 16 19 17.1193 19 18.5Z"
									stroke="currentColor"
									stroke-width="1.5"
								></path>
								<path
									d="M19 5.5C19 6.88071 17.8807 8 16.5 8C15.1193 8 14 6.88071 14 5.5C14 4.11929 15.1193 3 16.5 3C17.8807 3 19 4.11929 19 5.5Z"
									stroke="currentColor"
									stroke-width="1.5"
								></path>
							</g></svg
						>
					</Button>
					<Button square color="transparent">
						<svg
							width="16px"
							height="16px"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
								id="SVGRepo_tracurrentColorerCarrier"
								stroke-linecurrentcap="round"
								stroke-linejoin="round"
							></g><g id="SVGRepo_icurrentColoronCarrier">
								<path
									d="M2.5 6.5C2.5 4.29086 4.29086 2.5 6.5 2.5C8.70914 2.5 10.5 4.29086 10.5 6.5V9.16667C10.5 9.47666 10.5 9.63165 10.4659 9.75882C10.3735 10.1039 10.1039 10.3735 9.75882 10.4659C9.63165 10.5 9.47666 10.5 9.16667 10.5H6.5C4.29086 10.5 2.5 8.70914 2.5 6.5Z"
									stroke="currentColor"
									stroke-width="1.5"
								></path>
								<path
									d="M13.5 14.8333C13.5 14.5233 13.5 14.3683 13.5341 14.2412C13.6265 13.8961 13.8961 13.6265 14.2412 13.5341C14.3683 13.5 14.5233 13.5 14.8333 13.5H17.5C19.7091 13.5 21.5 15.2909 21.5 17.5C21.5 19.7091 19.7091 21.5 17.5 21.5C15.2909 21.5 13.5 19.7091 13.5 17.5V14.8333Z"
									stroke="currentColor"
									stroke-width="1.5"
								></path>
								<path
									d="M2.5 17.5C2.5 15.2909 4.29086 13.5 6.5 13.5H8.9C9.46005 13.5 9.74008 13.5 9.95399 13.609C10.1422 13.7049 10.2951 13.8578 10.391 14.046C10.5 14.2599 10.5 14.5399 10.5 15.1V17.5C10.5 19.7091 8.70914 21.5 6.5 21.5C4.29086 21.5 2.5 19.7091 2.5 17.5Z"
									stroke="currentColor"
									stroke-width="1.5"
								></path>
								<path
									d="M13.5 6.5C13.5 4.29086 15.2909 2.5 17.5 2.5C19.7091 2.5 21.5 4.29086 21.5 6.5C21.5 8.70914 19.7091 10.5 17.5 10.5H14.6429C14.5102 10.5 14.4438 10.5 14.388 10.4937C13.9244 10.4415 13.5585 10.0756 13.5063 9.61196C13.5 9.55616 13.5 9.48982 13.5 9.35714V6.5Z"
									stroke="currentColor"
									stroke-width="1.5"
								></path>
							</g></svg
						>
					</Button>
					<Button square color="transparent">
						<svg
							width="16px"
							height="16px"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
								id="SVGRepo_tracerCarrier"
								stroke-linecap="round"
								stroke-linejoin="round"
							></g><g id="SVGRepo_iconCarrier">
								<circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" stroke-width="1.5"
								></circle>
								<path
									d="M20 20L22 22"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
								></path>
							</g></svg
						>
					</Button>
				{/snippet}
			</Topnav>
			<Tabnav pages = {[
				{
					title: 'Filter',
					icon: 'mdi:information',
					link: '/filter'
				},
				{
					title: 'Deneme Sayfası 1',
					icon: 'mdi:phone',
					link: '/deneme'
				},
				{
					title: 'Icons',
					icon: 'mdi:settings',
					link: '/icons'
				},
				{
					title: 'Ajax Search',
					icon: 'mdi:settings',
					link: '/ajaxsearch'
				},
				{
					title: 'Forms',
					icon: 'mdi:settings',
					link: '/forms'
				},
				{
					title: 'Input Test',
					icon: 'mdi:settings',
					link: '/inputtest'
				},
				{
					title: 'Modal Test',
					icon: 'mdi:settings',
					link: '/modaltest'
				},
				{
					title: 'Pagination',
					icon: 'mdi:settings',
					link: '/pagination'
				}
			]}/>
		</Navbar>
		<Content>
			{@render children()}
		</Content>
	</Main>
</Layout>
