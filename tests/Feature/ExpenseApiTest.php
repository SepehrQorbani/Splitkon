<?php

namespace Tests\Feature;

use App\Models\Expense;
use App\Models\Group;
use App\Models\Member;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExpenseApiTest extends TestCase
{
    use RefreshDatabase;

    protected $group;
    protected $member;
    protected $url;

    public function setUp(): void
    {
        parent::setUp();

        $this->group = Group::create(['title' => 'my group', 'description' => 'my description']);
        $this->member = Member::create([
            'group_id' => $this->group->id,
            'name' => 'sepehr',
            'ratio' => 2,
            'total_expenses' => 0,
            'total_payments' => 0
        ]);
        $this->url = "/api/groups/{$this->group->edit_token}/expenses";
        // $this->member = Member::create([
        //     'group_id' => $this->group->id,
        //     'name' => 'soroosh',
        //     'ratio' => 1,
        //     'total_expenses' => 0,
        //     'total_payments' => 0
        // ]);
        // $this->member = Member::create([
        //     'group_id' => $this->group->id,
        //     'name' => 'arvin',
        //     'ratio' => 3,
        //     'total_expenses' => 0,
        //     'total_payments' => 0
        // ]);

        // Mock authentication with edit access
        // $this->withMiddleware();
        // // $this->actingAs($this->member->user);
        // $this->app['request']->attributes->add([
        //     'group' => $this->group,
        //     'access' => 'edit'
        // ]);
    }

    public function test_can_list_expenses()
    {
        Expense::factory()->count(3)->create([
            'group_id' => $this->group->id,
            'spender_id' => $this->member->id
        ]);
        // dd($this->group->token);
        $response = $this->getJson($this->url);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'amount',
                        'description',
                        'date',
                        'spender',
                        'members',
                        'attachments'
                    ]
                ]
            ]);
    }

    public function test_can_create_expense()
    {
        $data = [
            'title' => 'Test Expense',
            'amount' => 100.00,
            'description' => 'Test description',
            'date' => '2025-04-06',
            'spender_id' => $this->member->id,
            'members' => [
                ['id' => $this->member->id, 'ratio' => 1]
            ],
            // Note: file upload testing would require mocking the storage
        ];

        $response = $this->postJson($this->url, $data);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'title',
                    'amount',
                    'description',
                    'date',
                    'spender',
                    'members',
                    'attachments'
                ]
            ]);

        $this->assertDatabaseHas('expenses', [
            'title' => 'Test Expense',
            'amount' => 100.00,
            'group_id' => $this->group->id
        ]);
    }

    public function test_create_expense_validation()
    {
        $response = $this->postJson($this->url, [
            'amount' => -1, // Invalid amount
            'date' => 'invalid-date'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'amount', 'date', 'spender_id']);
    }

    public function test_can_show_expense()
    {
        $expense = Expense::factory()->create([
            'group_id' => $this->group->id,
            'spender_id' => $this->member->id
        ]);

        $response = $this->getJson("{$this->url}/{$expense->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['title' => $expense->title]);
    }

    public function test_can_update_expense()
    {
        $expense = Expense::factory()->create([
            'group_id' => $this->group->id,
            'spender_id' => $this->member->id,
        ]);

        $data = [
            'title' => 'Updated Title',
            'amount' => 200
        ];

        $response = $this->patchJson("{$this->url}/{$expense->id}", $data);
        $response->assertStatus(200)
            ->assertJsonFragment(['title' => 'Updated Title']);

        $this->assertDatabaseHas('expenses', [
            'id' => $expense->id,
            'title' => 'Updated Title',
            'amount' => 200
        ]);
    }

    public function test_can_delete_expense()
    {
        $expense = Expense::factory()->create([
            'group_id' => $this->group->id,
            'spender_id' => $this->member->id
        ]);

        $response = $this->deleteJson("{$this->url}/{$expense->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('expenses', ['id' => $expense->id]);
    }
}